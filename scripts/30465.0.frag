#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233+0.0001)))* 
        43758.5453123);
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy -0.5 )*vec2(resolution.x/resolution.y,1.0);
	vec2 position = vec2(fract(atan(pos.y,pos.x)/6.2831853),length(pos));
	
	position.x *= 100.*(sin(time/10.0));
	position.y *= 5.*((time/10.0));;
	
	
	float line = floor(position.y);
	position.x += time*40.*(mod(line,2.)*2. -1.)*random(vec2(line));
	
	
	vec2 ipos = floor(position);
	
	
	vec3 color = vec3(step(mouse.y*random(vec2(line)), mouse.x*random(ipos)));
	
	
	gl_FragColor = vec4( color, 1.0 );

}