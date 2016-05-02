
Instructions:
=============

VM-instructions and encoding:
-----------------------------

    Instr bits  | Name | Description
    ------------+------+------------
    00 00 00 00 | NOP  | No operation
    00 00 01 XX | LD   | Load next Byte into register XX and skip execution over it
                |      |
    00 01 00 XX | DEC  | Decrement register XX by one
    00 01 01 XX | INC  | Increment register XX by one
    00 01 10 XX | NOT  | Bitwise NOT of Register XX
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
    11 10 XX YY | SEQ  | Skip if equal
    11 11 XX YY | SNE  | Skip if not equal

Aliases:
--------

    Instruction | Alias for | Description
    ------------+-----------+------------
    NEG XX      | SUB RZ XX | Gives the 2-complement of a number

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

    LD RA 64        // Load motor speed and direction Fwd 50%
    LD RB 120       // Load time to drive for Two seconds


    STA Mot1 RA    // Set Motor 1
    STA Mot2 RA    // Set Motor 2

    STA Timer RB   // Setup timer

    loop:
    LDA Timer RC  // Read timer value
    SEQ RZ RC      // Skip next instruction if time is up
    JBW loop       // Loop

    STA Mot1 RZ       // Stop Motor 1
    STA Mot2 RZ       // Stop Motor 2
