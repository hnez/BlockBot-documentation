Abstract
========

Reliable Streams over crappy carrier (rsocc).

Rssoc is a protocol intended to provide reliable,
in order delivery of stream data over unreliable
rf links with short datagram sizes.
(Inspired by TCP)

Packet format
=============

    +---------------+-------------------------------+
    |     Offset    |          Bit number           |
    | Octet | Bit   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
    +---+---+---+---+---+---+---+---+---------------+
    |     0 |     0 |  Data Pipe    | S | A | F |   |
    |     1 |     8 |         Sequence Number       |
    |     2 |    16 |    Acknowledgment Number      |
    |     3 |    24 |  Payload Len  |  Window size  |
    |     4 |    32 |            Payload            |
    |   ... |   ... |                               |
    +-------+-------+-------------------------------+

Data Pipe (4 bits)
------------------

Identifies which pipe number sender and receiver are configured to use.
This is pre shared information and should be configurable at least in
the sender.

Flags (4 bits)
--------------

Contains 3 1-bit flags

- SYN Synchronize sequence numbers. This flag is set in the first message of
  each peer to start a communication.

- ACK Indicates that messages up to and including the sequence number in the
  acknoledge field were successfully received.

- FIN Signals that this was the last message a peer sends.

Sequence Number (8 bits)
------------------------

If the SYN flag is set, this is the first sequence number and it should be included
in the answering handshake message.
If the SYN flag is not set this is the sequence number of the current message.
The sequence number is incremented by one for each subsequent message and wraps around
at 255.

Acknowledgment Number (8bits)
-----------------------------

If the ACK flag is set, this is the number of the last successfully received message from
the peer.

Payload Len (4bits)
-------------------

This is the number of payload bytes following the header.

Window Size (4bits)
-------------------

This is the number of maximum length packages the sender
can receive without overflowing the buffer.
