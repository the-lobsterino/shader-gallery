#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

float circle(in vec2 _st, in float _radius, in float _smoothing){
    vec2 dist = _st;
	return 1.-smoothstep(_radius-(_radius*_smoothing),
                         _radius+(_radius*_smoothing),
                         dot(dist,dist)*4.0);
}

void main( void ) {
	
	vec2 p = surfacePosition;
	vec2 m = mouse * 2.0 - 1.0;
	float t = (surfaceSize.x*surfaceSize.y);
	
	//gl_FragColor = vec4(circle(surfacePosition,mouse.x,mouse.y));
	gl_FragColor = vec4(distance(surfacePosition,mouse-vec2(.5)));

}