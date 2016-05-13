Abstract
========

This document describes the file and message formats used
to store and transmit brick information and
other informations like robot telemetry.

Packet formats
==============

Common
------

Multiple byte fields are stored in network byte
order.

Each packet starts with a 16bit type field and
a 16bit length field to keep the protocol extensible
and agnostic to unkown packet types.

Type fields
-----------

    0x0001 | CHAIN_AQ   | Aquisition request
           |            |
    0x0100 | BRICK_CONT | Brick container
    0x0101 | BRICK_NAME | Human readable name of a brick
    0x0102 | BRICK_BC   | The machine readable bytecode
    0x0103 | BRICK_PREP | Determines which bytecode bytes are parameters

    0x0200 | TMTY_BRNR  | Telemetry feedback about the currently executed brick
    0x0201 | TMTY_BAT   | Feedback about the battery status

    0xff00 | ERR_TX     | Checksum missmatch or timeout occured
    
CHAIN_AQ
------

    CHAIN_AQ (16bit) | Length (16bit) | Checksum (16bit) | Payload

An aquisition request is a conatiner packet used to describe and
collect a complete brick chain.

An aquisition request packet may contain an arbitrary number of
subpackets as long as the length field can still contain the complete
length.

Upon receivial of an `CHAIN_AQ` packet a ...

- ... hop containing a bytecode should prepend a packet of type
  `BRICK_CONT` or `BRICK_BC` to the payload of the packet and update
  the checksum and length field before forwarding the packet to the next hop.

- ... hop that does not contain bytecode or executes programs
  should forward the packet unchanged.
  The checksum may be checked.

- ... hop that executes programs should store the bytecode to its
  bytecode buffer and optionally start executing it.
  The hop should also check the checksum and return a ERR_TX packet
  if it did not match.

BRICK_CONT
----------

    BRICK_CONT (16bit) | Length (16bit) | Payload

A brick container contains all informations regarding a physical brick.
This is the prefered packet kind a brick hop should prepend to the
payload of a `CHAIN_AQ` packet.

BRICK_NAME
----------

    BRICK_NAME (16bit) | Length (16bit) | Brick name (1-8 bytes)

This packet may only occur in `BRICK_CONT` containers and sets the
human readable name of said container.
The length of the name should not exceed 8 bytes and should consist
exclusively of ASCII characters.

BRICK_BC
--------

    BRICK_BC (16bit) | Length (16bit) | Bytecode

This packet may only occur in `BRICK_CONT` containers and sets the
bytecode of said container.
The bytecode format is specified in the _bytecode_ document.

BRICK_PREP
----------

    BRICK_PREP (16bit) | Length (16bit) | Parameter number (16bit) | Replace addresses n·(16bits)

This packet may not be forwarded to other hops.

This packet tells a brick unit which bytes in the bytecode should be replaced
by parameters that can be set by input devices (potentiometer, switch) on the
brick.

TMTY_BRNR
---------

    TMTY_BRNR (16bit) | Length (16bit) | Brick number (16bit)

This packet provides feedback feedback about the currently executed
brick number and may be used to provide program flow feedback to the user.

It should be forwarded to the previos brick with an active connection.

TMTY_BAT
--------

    TMTY_BAT (16bit) | Length (16bit) | Battery status (16bit)

This packet provides an estimation of the battery status of a hop.
A value of 0xffff should correspond to a full battery, a value of
0x0000 to a completely dead one.

ERR_TX
------

    ERR_TX (16bit) | Length (16bit) | Generating packet type (16bit)

This packet should be sent back to the other peer, when an error
occures while receiving a message.

When no back channel is available the error report may be omitted.
