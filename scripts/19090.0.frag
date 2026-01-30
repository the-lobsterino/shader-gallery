#ifdef GL_ES
precision mediump float;
#endif

// Sierpinski globe
// Autgenerated from Forth Haiku
// Generator by Stainless
// Haiku by DarkstarAG

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float vars[32];
	float stack[8];
	 vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vars[0] = 0.5000000;
	vars[1] = vars[0];   // dup
	vars[0] = vars[1] * vars[0];
	vars[1] = position.x;     // x
	vars[2] = 0.5000000;
	vars[1] = vars[1] - vars[2];
	vars[2] = position.y;    // y
	vars[3] = 0.5000000;
	vars[2] = vars[2] - vars[3];
	vars[3] = vars[2];   // dup
	vars[2] = vars[3] * vars[2];
	vars[3] = vars[2];   // swap
	vars[2] = vars[1];   // swap
	vars[1] = vars[3];   // swap
	vars[3] = vars[2];   // dup
	vars[2] = vars[3] * vars[2];
	vars[1] = vars[2] + vars[1];
	vars[1] =  sqrt(vars[1]);
	vars[2] = vars[1];   // dup
	vars[1] = vars[2] * vars[1];
	vars[0] = vars[0] - vars[1];
	vars[0] =  sqrt(vars[0]);
	vars[1] = position.x;     // x
	vars[2] = 0.5000000;
	vars[1] = vars[1] - vars[2];
	vars[0] = atan(vars[0],vars[1]);
	vars[1] =  3.1415926535897931;
	vars[0] = vars[0] / vars[1];
	vars[1] = time;    // t
	vars[2] = 10.0000000;
	vars[1] = vars[1] / vars[2];
	vars[0] = vars[1] + vars[0];
	vars[1] = position.y;    // y
	vars[2] = 0.5000000;
	vars[1] = vars[1] - vars[2];
	vars[2] = vars[1];   // dup
	vars[3] = vars[2];   // dup
	vars[2] = vars[3] * vars[2];
	vars[3] = 1.0000000;
	vars[2] = vars[2] - vars[3];
	vars[2] = - vars[2];
	vars[2] =  sqrt(vars[2]);
	vars[3] = vars[2];   // swap
	vars[2] = vars[1];   // swap
	vars[1] = vars[3];   // swap
	vars[3] = 1.0000000;
	vars[2] = vars[3] + vars[2];
	vars[1] = atan(vars[1],vars[2]);
	vars[2] = 2.0000000;
	vars[1] = vars[2] * vars[1];
	vars[2] = 2.0000000;
	vars[1] = vars[2] * vars[1];
	vars[2] =  3.1415926535897931;
	vars[1] = vars[1] / vars[2];
	stack[0] = vars[1];  // push
	stack[1] = vars[0];  // push
	vars[0] = 0.0000000;
	vars[1] = 3.0000000;
	vars[2] = vars[1];   // dup
	vars[3] = vars[2];   // dup
	vars[4] = stack[1];  // pop
	vars[5] = vars[4];   // dup
	stack[1] = vars[5];  // push
	vars[3] = vars[4] * vars[3];
	vars[3] =  floor(vars[3]);
	vars[4] = 3.0000000;
	vars[3] = mod(vars[3],vars[4]);
	vars[4] = 1.0000000;
	if (vars[4] == vars[3])  vars[3] = 1.0;   // ==
	else vars[3]=0.0;
	vars[4] = vars[3];   // swap
	vars[3] = vars[2];   // swap
	vars[2] = vars[4];   // swap
	vars[4] = stack[1];  // pop
	vars[5] = stack[0];  // pop
	vars[6] = vars[5];   // dup
	stack[0] = vars[6];  // push
	vars[6] = vars[5];   // swap
	vars[5] = vars[4];   // swap
	vars[4] = vars[6];   // swap
	stack[1] = vars[5];  // push
	vars[3] = vars[4] * vars[3];
	vars[3] =  floor(vars[3]);
	vars[4] = 3.0000000;
	vars[3] = mod(vars[3],vars[4]);
	vars[4] = 1.0000000;
	if (vars[4] == vars[3])  vars[3] = 1.0;   // ==
	else vars[3]=0.0;
	if ((vars[3]!=0.0) && (vars[2]!=0.0) ) 
		vars[2] = 1.0;   // >
	else vars[2]=0.0;
	vars[3] = vars[2];   // swap
	vars[2] = vars[1];   // swap
	vars[1] = vars[3];   // swap
	vars[3] = 3.0000000;
	vars[2] = vars[3] * vars[2];
	vars[3] = vars[2];   // dup
	vars[4] = vars[3];   // dup
	vars[5] = stack[1];  // pop
	vars[6] = vars[5];   // dup
	stack[1] = vars[6];  // push
	vars[4] = vars[5] * vars[4];
	vars[4] =  floor(vars[4]);
	vars[5] = 3.0000000;
	vars[4] = mod(vars[4],vars[5]);
	vars[5] = 1.0000000;
	if (vars[5] == vars[4])  vars[4] = 1.0;   // ==
	else vars[4]=0.0;
	vars[5] = vars[4];   // swap
	vars[4] = vars[3];   // swap
	vars[3] = vars[5];   // swap
	vars[5] = stack[1];  // pop
	vars[6] = stack[0];  // pop
	vars[7] = vars[6];   // dup
	stack[0] = vars[7];  // push
	vars[7] = vars[6];   // swap
	vars[6] = vars[5];   // swap
	vars[5] = vars[7];   // swap
	stack[1] = vars[6];  // push
	vars[4] = vars[5] * vars[4];
	vars[4] =  floor(vars[4]);
	vars[5] = 3.0000000;
	vars[4] = mod(vars[4],vars[5]);
	vars[5] = 1.0000000;
	if (vars[5] == vars[4])  vars[4] = 1.0;   // ==
	else vars[4]=0.0;
	if ((vars[4]!=0.0) && (vars[3]!=0.0) ) 
		vars[3] = 1.0;   // >
	else vars[3]=0.0;
	vars[4] = vars[3];   // swap
	vars[3] = vars[2];   // swap
	vars[2] = vars[4];   // swap
	vars[4] = 3.0000000;
	vars[3] = vars[4] * vars[3];
	vars[4] = vars[3];   // dup
	vars[5] = vars[4];   // dup
	vars[6] = stack[1];  // pop
	vars[7] = vars[6];   // dup
	stack[1] = vars[7];  // push
	vars[5] = vars[6] * vars[5];
	vars[5] =  floor(vars[5]);
	vars[6] = 3.0000000;
	vars[5] = mod(vars[5],vars[6]);
	vars[6] = 1.0000000;
	if (vars[6] == vars[5])  vars[5] = 1.0;   // ==
	else vars[5]=0.0;
	vars[6] = vars[5];   // swap
	vars[5] = vars[4];   // swap
	vars[4] = vars[6];   // swap
	vars[6] = stack[1];  // pop
	vars[7] = stack[0];  // pop
	vars[8] = vars[7];   // dup
	stack[0] = vars[8];  // push
	vars[8] = vars[7];   // swap
	vars[7] = vars[6];   // swap
	vars[6] = vars[8];   // swap
	stack[1] = vars[7];  // push
	vars[5] = vars[6] * vars[5];
	vars[5] =  floor(vars[5]);
	vars[6] = 3.0000000;
	vars[5] = mod(vars[5],vars[6]);
	vars[6] = 1.0000000;
	if (vars[6] == vars[5])  vars[5] = 1.0;   // ==
	else vars[5]=0.0;
	if ((vars[5]!=0.0) && (vars[4]!=0.0))  
		vars[4] = 1.0;   // >
	else vars[4]=0.0;
	vars[5] = vars[4];   // swap
	vars[4] = vars[3];   // swap
	vars[3] = vars[5];   // swap
	vars[5] = 3.0000000;
	vars[4] = vars[5] * vars[4];
	vars[5] = vars[4];   // dup
	vars[6] = vars[5];   // dup
	vars[7] = stack[1];  // pop
	vars[8] = vars[7];   // dup
	stack[1] = vars[8];  // push
	vars[6] = vars[7] * vars[6];
	vars[6] =  floor(vars[6]);
	vars[7] = 3.0000000;
	vars[6] = mod(vars[6],vars[7]);
	vars[7] = 1.0000000;
	if (vars[7] == vars[6])  vars[6] = 1.0;   // ==
	else vars[6]=0.0;
	vars[7] = vars[6];   // swap
	vars[6] = vars[5];   // swap
	vars[5] = vars[7];   // swap
	vars[7] = stack[1];  // pop
	vars[8] = stack[0];  // pop
	vars[9] = vars[8];   // dup
	stack[0] = vars[9];  // push
	vars[9] = vars[8];   // swap
	vars[8] = vars[7];   // swap
	vars[7] = vars[9];   // swap
	stack[1] = vars[8];  // push
	vars[6] = vars[7] * vars[6];
	vars[6] =  floor(vars[6]);
	vars[7] = 3.0000000;
	vars[6] = mod(vars[6],vars[7]);
	vars[7] = 1.0000000;
	if (vars[7] == vars[6])  vars[6] = 1.0;   // ==
	else vars[6]=0.0;
	if ((vars[6]!=0.0) && (vars[5]!=0.0))  vars[5] = 1.0;   // >
	else vars[5]=0.0;
	vars[6] = vars[5];   // swap
	vars[5] = vars[4];   // swap
	vars[4] = vars[6];   // swap
	vars[6] = 3.0000000;
	vars[5] = vars[6] * vars[5];
	vars[6] = vars[5];   // dup
	vars[7] = vars[6];   // dup
	vars[8] = stack[1];  // pop
	vars[9] = vars[8];   // dup
	stack[1] = vars[9];  // push
	vars[7] = vars[8] * vars[7];
	vars[7] =  floor(vars[7]);
	vars[8] = 3.0000000;
	vars[7] = mod(vars[7],vars[8]);
	vars[8] = 1.0000000;
	if (vars[8] == vars[7])  vars[7] = 1.0;   // ==
	else vars[7]=0.0;
	vars[8] = vars[7];   // swap
	vars[7] = vars[6];   // swap
	vars[6] = vars[8];   // swap
	vars[8] = stack[1];  // pop
	vars[9] = stack[0];  // pop
	vars[10] = vars[9];   // dup
	stack[0] = vars[10];  // push
	vars[10] = vars[9];   // swap
	vars[9] = vars[8];   // swap
	vars[8] = vars[10];   // swap
	stack[1] = vars[9];  // push
	vars[7] = vars[8] * vars[7];
	vars[7] =  floor(vars[7]);
	vars[8] = 3.0000000;
	vars[7] = mod(vars[7],vars[8]);
	vars[8] = 1.0000000;
	if (vars[8] == vars[7])  vars[7] = 1.0;   // ==
	else vars[7]=0.0;
	if ((vars[7]!=0.0) && (vars[6]!=0.0))  vars[6] = 1.0;   // >
	else vars[6]=0.0;
	vars[7] = vars[6];   // swap
	vars[6] = vars[5];   // swap
	vars[5] = vars[7];   // swap
	vars[7] = 3.0000000;
	vars[6] = vars[7] * vars[6];

	vars[4] = vars[5] + vars[4];
	vars[3] = vars[4] + vars[3];
	vars[2] = vars[3] + vars[2];
	vars[1] = vars[2] + vars[1];
	vars[0] = vars[1] + vars[0];
	vars[1] = stack[1];  // pop

	vars[1] = stack[0];  // pop

	vars[1] = 0.5000000;
	vars[2] = vars[1];   // dup
	vars[1] = vars[2] * vars[1];
	vars[2] = position.x;     // x
	vars[3] = 0.5000000;
	vars[2] = vars[2] - vars[3];
	vars[3] = position.y;    // y
	vars[4] = 0.5000000;
	vars[3] = vars[3] - vars[4];
	vars[4] = vars[3];   // dup
	vars[3] = vars[4] * vars[3];
	vars[4] = vars[3];   // swap
	vars[3] = vars[2];   // swap
	vars[2] = vars[4];   // swap
	vars[4] = vars[3];   // dup
	vars[3] = vars[4] * vars[3];
	vars[2] = vars[3] + vars[2];
	vars[2] =  sqrt(vars[2]);
	vars[3] = vars[2];   // dup
	vars[2] = vars[3] * vars[2];
	vars[1] = vars[1] - vars[2];
	vars[1] =  sqrt(vars[1]);
	vars[0] = vars[1] * vars[0];
	vars[1] = position.x;     // x
	vars[2] = 0.5000000;
	vars[1] = vars[1] - vars[2];
	vars[2] = position.y;    // y
	vars[3] = 0.5000000;
	vars[2] = vars[2] - vars[3];
	vars[3] = vars[2];   // dup
	vars[2] = vars[3] * vars[2];
	vars[3] = vars[2];   // swap
	vars[2] = vars[1];   // swap
	vars[1] = vars[3];   // swap
	vars[3] = vars[2];   // dup
	vars[2] = vars[3] * vars[2];
	vars[1] = vars[2] + vars[1];
	vars[1] =  sqrt(vars[1]);
	vars[2] = 0.5000000;
	if (vars[2] > vars[1])  vars[1] = 1.0;   // <
	else vars[1]=0.0;
	vars[0] = vars[1] * vars[0];
	vars[1] = time;    // t
	vars[2] = 12.0000000;
	vars[1] = vars[1] / vars[2];
	vars[1] =  sin(vars[1]);
	vars[2] = 5.0000000;
	vars[1] = vars[2] * vars[1];
	vars[0] = vars[1] + vars[0];
	vars[1] = vars[0];   // dup
	vars[2] = 3.0000000;
	vars[1] = vars[2] * vars[1];
	vars[2] = 1.0000000;
	vars[1] = vars[2] + vars[1];
	vars[1] =  sin(vars[1]);
	vars[2] = vars[1];   // swap
	vars[1] = vars[0];   // swap
	vars[0] = vars[2];   // swap
	vars[2] = vars[1];   // dup
	vars[3] = 3.0000000;
	vars[2] = vars[3] * vars[2];
	vars[3] = 0.0000000;
	vars[2] = vars[3] + vars[2];
	vars[2] =  sin(vars[2]);
	vars[3] = vars[2];   // swap
	vars[2] = vars[1];   // swap
	vars[1] = vars[3];   // swap
	vars[3] = vars[2];   // dup
	vars[4] = 3.0000000;
	vars[3] = vars[4] * vars[3];
	vars[4] = 5.0000000;
	vars[3] = vars[4] + vars[3];
	vars[3] =  sin(vars[3]);
	vars[4] = vars[3];   // swap
	vars[3] = vars[2];   // swap
	vars[2] = vars[4];   // swap

	gl_FragColor = vec4(vars[0],vars[1],vars[2],1);

}