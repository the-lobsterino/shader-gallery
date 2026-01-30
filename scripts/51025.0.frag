#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

layout(location=0) in vec4 in_Position;
layout(location=1) in vec4 in_Color;

out vec4 gl_Position; 
out vec4 ex_Color;
 
uniform mat4 myMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
 


void main(void)
  {
    gl_Position = myMatrix*in_Position;
	ex_Color=in_Color;
 
   } 