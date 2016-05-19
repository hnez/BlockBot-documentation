Abstract
========

Reliable Streams over crappy carrier (rsocc).

Rssoc is a protocol intended to provide reliable,
in order delivery of stream data over unreliable
rf links with short datagram sizes.
(Inspired by TCP)

Packet format
=============


        Offset    |          Bit number
    Octet | Bit   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    ------+-------+---+---+---+---+---------------
        0 |     0 |  Data Pipe    |  Window size
        1 |     8 |         Sequence Number
        2 |    16 |    Acknowledgment Number
        3 |    24 | S | A | F |   Payload Len
        4 |    32 |            Payload
      ... |   ... |

Data Pipe (4 bits)
------------------

Identifies which pipe number sender and receiver are configured to use.
This is pre shared information and should be configurable at least in
the sender.

Window Size (4bits)
-------------------

This is the number of maximum length messages the sender
can receive without overflowing the buffer.

The maximum length should be pre shared information between
the peers, 16 payload bytes should be considered a reasonable value.


Sequence Number (8 bits)
------------------------

If the SYN flag is set, this is the first sequence number and it should be included
in the answering handshake message.
If the SYN flag is not set this is the sequence number of the current message.
The sequence number is incremented by one for each subsequent message
if it contains payload and wraps around at 255.

Acknowledgment Number (8bits)
-----------------------------

If the ACK flag is set, this is the number of the last successfully received message from
the other peer.

Flags (3 bits)
--------------

Contains 3 1-bit flags

- SYN - Synchronize sequence numbers. This flag is set in the first message of
  each peer to start a communication.

- ACK - Indicates that messages up to and including the sequence number in the
   `Acknoledgement Number` field were successfully received.

- FIN - Signals that the peer wants the connection to be closed.

Payload Len (5bits)
-------------------

This is the number of payload bytes following the header.

Connection lifetime
===================

Handshake
---------

### SYN

To establish a new connection a controller sends a message
without payload and the `SYN` flag set to the robot.

The `Data Pipe` field has to be set to the same data pipe the
robot is configured to use.

The `Sequence number` field should contain a random number.

The `Acknoledgement Number` field should be zero.

And the `Window size` field should contain the number
of available slots in the receive buffer.

### SYN-ACK

The robot sends back a message without payload and
the `SYN` and `ACK` fields set.

Except for the `Acknoledgement Number` field
the same rules as above apply.

The `Acknoledgement Number` field should be set to the
Sequence number received in the SYN message.

### ACK

The controller then answers with a
packet with optional payload and the
`ACK` flag set. The `Acknoledgement Number`
field should be the sequence number the robot sent.
The `Sequence number` field should contain the Sequence
Number of the first message.

Messages that were not acknoledged in a specified
time should be resent.

Connection open
---------------

After peforming the three way hanshake the connection
is considered _open_.

Both peers are now free to send messages at any time.

Every message with a payload should contain the Sequence number of
the last message received from the other peer
in the `Acknoledgement Number` field.
And the Sequence number of the last message
sent, incremented by one, in the `Sequence number` field.

Messages without payload should contain the same fields as
above but with the Sequence Number not incremented by one.

Every message should be Acknoledged by the other peer,
either in a message containing payload, or if no payload
to be sent is available in an empty message.

A message not Acknoledged in a specified time
should be re-sent until it gets acknoledged or
the maximum number of retransmissions is reached.
If the maximum number of retransmissions is reached
the connection should be considered _closed_.

Close connection
----------------

###FIN
To cleanly close a connection a message with optional
payload and the `FIN` flag set should be sent by either peer.

###FIN-ACK
The other peer should answer with a message without payload
and the `FIN` and `ACK` flags set.

###ACK
The peer initiating the closing of the connection
should acknoledge the FIN-ACK message with an
empty message with a set `ACK` Flag.

Messages that were not acknoledged in a specified
time should be resent.

Example
=======

Shown below are the internal states of the communicating peers
and the communication flow between them.
To keep the diagramm clean only internal state variables that
changed between the current and previous state are shown.

    Controller               Packets              Robot
    ----------               -------              -----

    snum_local_cur     0                          snum_local_cur     0
    snum_local_acked   0                          snum_local_acked   0
    snum_remote_cur    0                          snum_remote_cur    0
    snum_remote_acked  0                          snum_remote_acked  0
    state         CLOSED                          state         CLOSED
    timeout_ka     65535                          timeout_ka     65535
    timeout_noack  65535                          timeout_noack  65535
    timeout_pkgsep     0                          timeout_pkgsep     0
    wsize_remote       0                          wsize_remote       0
    wsize_local        6                          wsize_local        3

                             SYN
                             wsize: 6, len:   0
                             seq:  93, ack:   0
                            ------------------->

    snum_local_cur    93                         snum_local_cur    113
    state       SYN_SENT                         state    SYN_RECEIVED
    timeout_ka      4096                         timeout_ka        512
    timeout_noack  16384                         timeout_noack   16384
    timeout_pgksep   256                         timeout_pkgsep    512
                                                 wsize_remote        6


                                 Waiting

    timeout_ka       3584                        timeout_ka          0
    timeout_noack   15872                        timeout_noack   15872
    timeout_pkgsep      0                        timeout_pkgsep      0

                             SYN ACK
                             wsize: 3, len:   0
                             seq: 113, ack:  93
                            <-------------------


    snum_local_acked   93                        snum_remote_acked  93
    snum_remote_cur   113                        state    SYN_ACK_SENT
    state            OPEN                        timeout_ka       4096
    timeout_ka       3584                        timeout_pkgsep    256
    timeout_noack   16384
    timeout_pkgsep    512
    wsize_remote        3

                              Collecting Data

    snum_local_cur     96
    wsize_local         3

                                 Waiting

    timeout_ka       3072                        timeout_ka       3072
    timeout_noack   15872                        timeout_noack   15360
    timeout_pkgsep      0                        timeout_pkgsep      0

                             ACK
                             wsize: 3, len:  16
                             seq:  94, ack: 113
                            ------------------->

    timeout_pkgsep    256                        wsize_local         2
                                                 wsize_remote        3
                                                 timeout_pkgsep    512

                                 Waiting

    timeout_ka       2816                        timeout_ka        512
    timeout_noack   15616                        timeout_noack   16384
    timeout_pkgsep      0                        timeout_pkgsep      0

                             ACK
                             wsize: 3, len:  16
                             seq:  95, ack: 113
                            ------------------->

    timeout_pkgsep    256                        wsize_local         1
                                                 timeout_pkgsep    512

                                 Waiting

    timeout_ka       2560                        timeout_ka        512
    timeout_noack   15360                        timeout_noack   16384
    timeout_pkgsep      0                        timeout_pkgsep      0


                             ACK
                             wsize: 3, len:  16
                             seq:  95, ack: 113
                            ------------------->

    timeout_pkgsep    256                        wsize_local         0
                                                 timeout_pkgsep    512

                                 Waiting


    timeout_ka       2304                        timeout_ka          0
    timeout_noack   15104                        timeout_noack   15872
    timeout_pkgsep      0                        timeout_pkgsep      0

                             ACK
                             wsize: 0, len:   0
                             seq: 113, ack:  96
                            <-------------------

    snum_local_acked   96                        snum_remote_acked  96
    timeout_noack   16384                        timeout_ka       4096
    timeout_pkgsep    512                        timeout_pkgsep    256
    wsize_remote        0
    wsize_local         6

                                 Waiting

    timeout_ka       1792                        timeout_ka       3584
    timeout_noack   15872                        timeout_noack   15360
    timeout_pkgsep      0                        timeout_pkgsep      0

                             FIN ACK
                             wsize: 6, len:   0
                             seq:  96, ack: 113
                            ------------------->

    state        FIN_SENT                        state    FIN_RECEIVED
    timeout_ka       4096                        timeout_ka        512
    timeout_pkgsep    256                        timeout_noack   16384
                                                 timeout_pkgsep    512
                                                 wsize_remote        6

                                 Waiting

    timeout_ka       3584                        timeout_ka          0
    timeout_noack   15872                        timeout_noack   15872
    timeout_pkgsep      0                        timeout_pkgsep      0


                             FIN ACK
                             wsize: 3, len:   0
                             seq: 113, ack:  96
                            <-------------------

    state    FIN_ACK_RCVD                        state    FIN_ACK_SENT
    ...                                          ...

                             FIN ACK
                             wsize: 6, len:   0
                             seq:  96, ack: 113
                            ------------------->

    state          CLOSED                        state          CLOSED
    ...                                          ...