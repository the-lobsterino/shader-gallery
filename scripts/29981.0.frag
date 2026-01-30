#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec3 color = vec3(1.0, 1.0, 1.0);
	float speed = 0.5;
	float scale = 0.5;
	float width = 10.0;
	float repeat = 20.0;
	
	speed = 10.0 / speed;
	float timeOffset = mod(time, speed) / speed;
	float timeXPos = resolution.x * timeOffset;
	vec3 resultColor = vec3(0.0, 0.0, 0.0);
	
	float xPos = gl_FragCoord.x;
	
	if (xPos <= timeXPos)
	{
	   float xTotal = gl_FragCoord.x / resolution.x;
	   float sinTotal = 3.14 * 2.0;
	   float yPercent = (sin(xTotal * sinTotal * repeat) / 2.0) + 0.5;
	   float sinYPos = (yPercent * resolution.y) * scale + (((1.0 - scale) * resolution.y) / 2.0);
	   float yPos = gl_FragCoord.y;
		
	   if (abs(sinYPos - yPos) < width)
           {
	       resultColor = color;  
	   }
	}

	gl_FragColor = vec4(resultColor, 1.0);
}