#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
#define PI = 3.1415

vec3 steps (vec3 og, vec3 ug, vec3 color)
{
	return vec3(1.0)*step(ug,color)*(vec3(1.0)-step(og, color));
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    	vec2 p = gl_FragCoord.xy;
	vec2 m = mouse;
	
    	vec3 col = vec3(0.0);
	
//Ellipse--------------------
	
	float r = 0.1;
	vec2 mid = m;
	vec3 c = vec3(1.0,0.0,0.0);
	vec2 dif = uv-mid;
	float l = length(dif);
	float angle = atan(dif.y,dif.x);
	float inside = smoothstep(r,r-0.01,l);
	
	col+= c*inside;
	
//End Ellipse----------------
	
	
	
	
//Game of Life---------------
	
	float og = 0.64;
	float ug = 0.1;
	float counter = 0.0;
	
	vec3 sumCol = vec3(0.0);
	vec3 sumCells = vec3(0.0);
	
	vec3 bCol = texture2D(backbuffer, uv).rgb;
	
	
	
	for (float x = -1.0; x <= 1.0; x++)
	{
		for (float y = -1.0; y <= 1.0; y++)
		{
			vec3 temp = vec3(0.0);
			bCol = texture2D(backbuffer, uv+vec2(x,y)/resolution.xy).rgb;	
			bCol = texture2D(backbuffer, uv+vec2(x,y-1.0*length(bCol))/resolution.xy).rgb;
			//innerhalb der Grenzen?
			temp = steps(vec3(og), vec3(ug),bCol);
			
			sumCells += temp;
			bCol = texture2D(backbuffer, uv+vec2(x,y-1.0)/resolution.xy).rgb;
			sumCol += bCol;
			
			counter++;
			
		}
	}
	
	og = 0.6666;
	ug = 0.3;
	
	//col+=vec3(1.0)* steps( vec3(og),vec3(ug),sumCells );
	col+=sumCol/counter* steps( vec3(og),vec3(ug),sumCells/(counter*1.0) );
	
	col+=sumCol/(counter*1.17)*smoothstep(vec3(ug),vec3(og),sumCol/(counter*1.0));
	
	//*steps( vec3(og),vec3(ug),sumCells/counter );
	
	//col+=vec3(1.0)/counter* steps( vec3(og),vec3(ug),sumCells/counter );
	
	
//End Game of Life-----------
	//col = vec3(0.0);
	gl_FragColor = vec4(col,1.0);
}