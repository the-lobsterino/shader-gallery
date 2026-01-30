#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

/*
by Atlas - Ukraine

Challenge! Optimized shapes without IF 
*/

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265359;
const float PI2 = 3.14159265359*2.0;





void drawGrid(out vec3 finalColor, in vec2 uv, float gridStep) {

	// Best GlslSandbox Grid
	vec3 gridColor = vec3(0.2) - finalColor;
	float gridUV = gridStep * (PI*2.0);
	float gridWidth = 1.0 - 0.0001 * (gridStep*PI);
	float grid = step(gridWidth, cos(uv.x*gridUV))+step(gridWidth, cos(uv.y*gridUV));

	finalColor = finalColor + vec3(grid*gridColor);
}

void drawCircle(out vec3 finalColor, in vec2 uv, in vec2 circlePos, in float circleSize) {

	// Best GlslSandbox Circle
	float circleSmooth = 1000.0 * circleSize;
	circleSize = circleSize*circleSize*0.25;
	circlePos.x = -circlePos.x;
	circlePos.y = -circlePos.y;

	
	vec3 circle = vec3(
		smoothstep(circleSize, 0.0, (  (uv.x + circlePos.x)*(uv.x + circlePos.x))+((uv.y + circlePos.y)*(uv.y + circlePos.y))  ) * circleSmooth
		);
	
	finalColor = circle + finalColor;
}






void main( void ) {

	vec2 uv = ( gl_FragCoord.xy - resolution.xy*0.5 ) / resolution.y;
	
	
	
	vec3 color = vec3(0.1);
	

	//uv *= mouse.x*10.0+1.0;
	//uv += vec2(sin(time)*0.1, cos(time)*0.1);


	drawGrid(color, uv, 10.0);
	drawCircle(color, uv, vec2(-0.25, 0.0), 0.1);
	
	
	
	// Line...
	
	
	vec2 START = vec2(0.0, 0.0);
	vec2 END = vec2(sin(time)*0.2+START.x, cos(time)*0.1+START.y);
	
	drawCircle(color, uv, vec2(START.x, START.y), 0.01);
	drawCircle(color, uv, vec2(END.x, END.y), 0.01);

	
	float lineSize = distance(START, END);
	
	vec2 A = vec2(0.0, 0.1);
	vec2 B = END;
	
	float angle;
	angle = sign(0.0+END.x)*(acos(dot(normalize(A),normalize(B))));
	
 
	

	


			     
	vec2 uvLine;
	
	uvLine = uv - vec2(START.x, START.y);
	uvLine.x -= sin(angle)*(0.5*lineSize);
	uvLine.y -= cos(angle)*(0.5*lineSize);
	
	uvLine = uvLine.x*vec2(cos(angle), sin(angle)) + uvLine.y*vec2(-sin(angle), cos(angle));
	
	
	float colorLine = step(uvLine.x*uvLine.x, 0.00001)*step(uvLine.y*uvLine.y, lineSize*lineSize*0.25);
	color += colorLine;
	
	

	
	
	// Cube...
	
	// Triangle and Polygon...
	
	
	color.b = 1.0;


	gl_FragColor = vec4(color, 1.0);
}