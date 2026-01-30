#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rot(vec2 p, float a) {
	return mat2(cos(a), -sin(a),
		sin(a), cos(a)) * p;
}

vec2 ifs(vec2 pos) {

  for ( int i = 0; i < 8; i ++ ) {
    	float intensity = pow( 2.0, -float( i ) );
    	pos = abs( pos ) - vec2( sin(time * 0.5) * 1.0 + 3.5, sin(time*(1.-sqrt(2.))) * 2.0 + 3.5) * intensity;
	pos = rot(pos, sin(time * 0.345) * intensity);  
    	if ( pos.x < pos.y ) { pos.xy = pos.yx; }
  }

  return pos;
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy - 0.5 ) * 30.0;
	pos = ifs(pos);

	float color = 0.0;
	color = length(pos) * 10.0;
	
	gl_FragColor = vec4(color * vec3(1, 1, 1), 1.0 );

}