#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//stoopid function stuff

uniform float time;
uniform vec2 resolution;

bool thingy(vec2 centre, vec2 pos, float rad) {
	float nx = pos.x - centre.x;
	float ny = pos.y - centre.y;
	if(sqrt((nx*nx)+(ny*ny)) > rad) {return true;} else {return false;}
}

void main( void ) {

	vec2 pos = vec2(( gl_FragCoord.x / resolution.x ), ( gl_FragCoord.y / resolution.x ) + (resolution.y/resolution.x)/2.0);

	float color;
	color = float(thingy(vec2(0.5,0.5), pos, abs(sin((10.0*time)+pos.x*20.0+pos.y*cos(time)*20.0)/5.0)));

	gl_FragColor = vec4( vec3( color, color , sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}