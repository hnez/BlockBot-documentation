
Instructions:
=============

VM-instructions and encoding:
-----------------------------

    Instr bits  | Name | Description

    00 00 00 00 | NOP  | No operation
    00 00 01 XX | LD   | Load next Byte into register XX and skip execution over it
    00 00 10 XX | NOT  | Bitwise NOT of Register XX

    00 01 00 XX | INC  | Add one to Register XX
    00 01 01 XX | DEC  | Subtract one from Register XX

    00 10 NN NN | JFW  | Jump forward NNNN instructions
    00 11 NN NN | JBW  | Jump backwards NNNN instructions

    01 0X XN NN | LDA  | Load io address NNN into register XX
    01 1X XN NN | STA  | Store Register XX into io address NNN

    10 00 XX YY | MOV  | Copy register content of YY to XX
    10 01 XX YY | OR   | Store logic or of XX and YY in XX
    10 10 XX YY | AND  | Store logic and of XX and YY in XX
    10 11 XX YY | XOR  | Store logic exclusive or of XX and YY in XX

    11 00 XX YY | ADD  | Store sum of XX and YY in XX
    11 01 XX YY | SUB  | Store difference of XX and YY in XX
    11 10 XX YY | SEQ  | Skip if equal
    11 11 XX YY | SNE  | Skip if not equal

Aliases:
--------

    Instruction | Alias for | Description
    NEG XX      | SUB RZ XX | Gives the 2-complement of a number

Registers:
==========

    Reg bits | Name | Description 
    00       | RZ   | Zero register. Allways reads as zero. Writes redirect to the other register in the command
    01       | RA   | General purpose register A
    10       | RB   | General purpose register B
    11       | RC   | General purpose register C

Memory Addresses:
=================

    Addr bits | Name  | Description
    0 00      | Mot1  | Signed Motor 1 speed
    0 01      | Mot2  | Signed Motor 2 speed
    0 10      | DIn   | Digital Inputs
    0 11      | DOut  | Digital Outputs

    1 00      | Timer | Counts down at 60Hz when set to something else than zero
    1 01      |
    1 10      |
    1 11      |

Examples:
=========

Drive forward for some time:
----------------------------

    LD RA           // Load motor speed and direction
    64              // Fwd 50%
    LD RB           // Load time to drive for
    120             // Two seconds
    
    STA RA 'Mot1'   // Set Motor 1
    STA RA 'Mot2'   // Set Motor 2
        
    STA RB 'Timer'  // Setup timer
     
    loop:
    LDA RC 'Timer' // Read timer value
    SEQ RZ RC      // Skip next instruction if time is up
    JBW loop       // Loop

    STA RZ 0       // Stop Motor 1     
    STA RZ 1       // Stop Motor 2


     

   