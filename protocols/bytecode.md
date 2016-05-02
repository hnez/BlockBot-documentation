
Instructions:
=============

VM-instructions and encoding:
-----------------------------

    Instr bits  | Name | Description
    ------------+------+------------
    00 00 00 00 |      | Reserved for later use
    00 00 00 01 | JIF  | Indirect forward jump. Jumps (RA << 8)|RB instructions forward
    00 00 00 10 | JIB  | Indirect backward jump. Jumps (RA << 8)|RB instructions backward
    00 00 00 11 | LDI  | Indirect load. Loads byte from (RA << 8)|RB
                |      |
    00 00 01 XX | LD   | Load next Byte into register XX and skip execution over it
    00 00 10 XX | SLZ  | Skip if register is less than zero (bit 7 is set)
    00 00 11 01 | SOV  | Skip if last arithmetic instruction generated an over- or underflow
                |      |
    00 01 00 XX | DEC  | Decrement register XX by one
    00 01 01 XX | INC  | Increment register XX by one
    00 01 10 XX | NOT  | Bitwise NOT of Register XX
    00 01 11 XX | SRR  | Shift register right by one bit
                |      |
    00 10 NN NN | JFW  | Jump forward NNNN instructions
    00 11 NN NN | JBW  | Jump backwards NNNN instructions
                |      |
    01 0N NN XX | LDA  | Load io address NNN into register XX
    01 1N NN XX | STA  | Store Register XX into io address NNN
                |      |
    10 00 XX YY | MOV  | Copy register content of YY to XX
    10 01 XX YY | OR   | Store logic or of XX and YY in XX
    10 10 XX YY | AND  | Store logic and of XX and YY in XX
    10 11 XX YY | XOR  | Store logic exclusive or of XX and YY in XX
                |      |
    11 00 XX YY | ADD  | Store sum of XX and YY in XX
    11 01 XX YY | SUB  | Store difference of XX and YY in XX
    11 10 XX YY | SEQ  | Skip next instruction if equal
    11 11 XX YY | SNE  | Skip next instruction if not equal

Aliases:
--------

    Instruction | Alias for | Description
    ------------+-----------+------------
    NEG XX      | SUB RZ XX | Gives the 2-complement of a number
    SRL XX      | ADD XX XX | Shift register left by one bit
    NOP         | SNE RZ RZ | No operation

Registers:
==========

    Reg bits | Name | Description
    ---------+------+------------
    00       | RZ   | Zero register. Allways reads as zero. Writes redirect to the other register in the command
    01       | RA   | General purpose register A
    10       | RB   | General purpose register B
    11       | RC   | General purpose register C

Memory Addresses:
=================

    Addr bits | Name  | Description
    ----------+-------+------------
    0 00      | Mot1  | Signed Motor 1 speed
    0 01      | Mot2  | Signed Motor 2 speed
    0 10      | DIn   | Digital Inputs
    0 11      | DOut  | Digital Outputs
              |       |
    1 00      | Timer | Counts down at 60Hz when set to something else than zero
    1 01      |       |
    1 10      |       |
    1 11      |       |

Examples:
=========

Drive forward for some time:
----------------------------

    LD RA 64       // Load motor speed and direction Fwd 50%
    LD RB 120      // Load time to drive for Two seconds

    STA Mot1 RA    // Set Motor 1
    STA Mot2 RA    // Set Motor 2

    STA Timer RB   // Setup timer

    loop:
    LDA Timer RC   // Read timer value
    SEQ RZ RC      // Skip next instruction if time is up
    JBW loop       // Loop

    STA Mot1 RZ    // Stop Motor 1
    STA Mot2 RZ    // Stop Motor 2

Drive forward until button one triggers, then turn right
--------------------------------------------------------

    LD RA 64        // Load motor speed and direction Fwd 50%
    LD RB 1         // Load bitmask

    STA Mot1 RA     // Set Motor 1
    STA Mot2 RA     // Set Motor 2

    waitbtn:
    LDA DIn RC      // Load digital input register
    AND RC RB       // Mask out all uninteresting bits
    SNE RZ RC       // Check if bit is set
    JBW waitbtn

    MOV RB RA       // Make a backup of the motor speed
    NEG RB          // and invert it

    STA Mot1 RB     // Drive backwards Motor 1
    STA Mot2 RB     // Drive backwards Motor 2

    delay:
    LD RC 60        // Load driving time
    STA Timer RC    // Start timer

    delaylp:
    LDA Timer RC    // Load timer value
    SEQ RZ RC       // Check if time is up
    JBW delaylp     // Loop if it is not

    SNE RZ RA       // When run for the first time RA contains the motor speed
    JFW stop        // When run for the second time it is set to zero below

    STA Mot1 RA     // Drive forwards Motor 1
    MOV RA RZ       // Indicate that motors should be stoped next time
    JBW delay       // Delay again

    stop:
    STA Mot1 RZ     // Stop Motor 1
    STA Mot2 RZ     // Stop Motor 2
    
    