#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 _FirePosition = vec4(0.5, 0.5, 0.0, 0.0);
float _Size = 4.0;
float _Power = 5.0;
float _Radius = -0.1;

float cellShading(float value, float delay){
	float power = time * 1.0 + delay;
	power = cos(power / 2.0);
	power = sin(power * 10.0) / (power + 20.0);
	return floor(value * 10.0) / (power * _Power + 20.0);
}

vec2 crenelate(vec2 value){
	// return value;
	return vec2(floor(value * 250.0) / 250.0);
}



void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 fire = vec2(_FirePosition.x, _FirePosition.y);
	float color = 0.0;
	color = 1.0 - (distance(crenelate(position), fire) + _Radius ) * _Size;
	color = clamp(color, 0.0, 5.5);
	color = cellShading(color, 0.0);
	gl_FragColor = vec4( vec3(color), 1.0 );

}