#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 fragCoord;

#define PI 3.14159265359

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy ;
  uv.y += 0.25*sin(time);
  float movingLine = 0.3*cos(10.0*(uv.x+time/2.0));//Moving Line
  float secondMovingLine = 0.3*cos(10.0*(uv.x+(time+5.0)/2.0));//Second Moving Line
  float colorR = 0.2+(0.3*(0.5+0.5*sin(time/2.0)))*secondMovingLine;
  float colorG = 0.3*(0.5*(1.0+sin(time)));
  float colorB = 0.2*(0.5+0.5*cos(time/4.0));
  uv.y += cos(uv.x+cos(time/4.0)*2.0)*movingLine;//Movement effect
	
  float color = 0.2 + 0.8*length(cos(uv*10.0-time/2.0));//flake effect
  //Fractional color component
  vec3 finalColor = vec3(colorR,colorG,colorB)*color;
  gl_FragColor = vec4(finalColor,1.0);
}