#ifdef GL_ES
precision mediump float;
#endif

// 3d plane written through trial and error
// unfinished

#define SQRT2 1.41421356237

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float w2 = resolution.x/2.0;
float h2 = resolution.y/2.0;

void main( void ) {
	float dist = 0.8;
	vec3 col = vec3(0, 0, 0);
	
	float ydist = (h2)-gl_FragCoord.y;
	float xdist = (w2)-gl_FragCoord.x;
	
	float xp = -time;
	float yp = 0.;//time;
	
	float xz = sin(radians(mouse.x*180.-90.))*w2;
	if(int(xz) == int(abs(w2))) xz = -xz;
	
	float z = ((gl_FragCoord.x-w2+xz) / (gl_FragCoord.y-h2)) * dist;
	
	if(gl_FragCoord.y < h2)
		col = vec3(  fract(xp + z) * (mod(gl_FragCoord.y-mod(yp*ydist,ydist/SQRT2), abs(ydist/SQRT2))) );
	else
		col = vec3(  fract(xp - z) * (mod(gl_FragCoord.y+mod(yp*ydist,ydist/SQRT2), abs(ydist/SQRT2))) );
	
	col -= h2/(abs(ydist)+100.);
	
	gl_FragColor = vec4( col-1., 1.0);
}