precision highp float;
uniform float time;
uniform vec2 resolution;
float m=50.;

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	float c = cos(p.x*m+cos(time/9.)*m)/sin(p.y*m*.31+sin(time/9.)*m)>1.?1.:0.;
	gl_FragColor = vec4( vec3(c,c,c),1);
}


