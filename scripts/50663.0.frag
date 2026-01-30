#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hidden_rect(vec2 position, vec2 org, vec2 ext, float cb){
	if(position.x > org.x && position.x < ext.x){
		if(position.y > org.y && position.y < ext.y){
			if (cb > 0.0){
				cb = 3.0;	
			}
		}
	}
	return cb;	
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution;	
	float cb = 1.0 - 3.0 * sqrt(pow(distance(mouse.x, position.x), 2.0) + pow(distance(mouse.y, position.y), 2.0)); 
	
	if (cb < 0.7) cb = 0.0;
	
	// hi
	cb = hidden_rect(position, vec2(0.45, 0.45), vec2(0.47, 0.55), cb);
	cb = hidden_rect(position, vec2(0.47, 0.49), vec2(0.53, 0.51), cb);
	cb = hidden_rect(position, vec2(0.53, 0.45), vec2(0.55, 0.55), cb);
	cb = hidden_rect(position, vec2(0.57, 0.45), vec2(0.59, 0.495), cb);
	cb = hidden_rect(position, vec2(0.57, 0.51), vec2(0.59, 0.525), cb);
	
	float cbr = abs(sin(time * 0.5)) * cb;
	float cbg = abs(cos(time * 0.5)) * cb;
	float cbb = abs(sin(time * 0.5) * cos(time * 0.5)) * cb;

	gl_FragColor = vec4(cbr,cbg, cbb, 1.0 );

}