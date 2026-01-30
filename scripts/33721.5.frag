#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

void main( void ) {
	gl_FragColor = vec4(1);
	vec2 x = gl_FragCoord.xy/resolution.x;
	
	// use the lowest pixels to store data
	if(gl_FragCoord.y < 2.){
		
		// edges
		if(gl_FragCoord.x < 2.){
			gl_FragColor = vec4(.5,0,0,1);
			return;
		}
		if(gl_FragCoord.x + 2. > resolution.x){
			gl_FragColor = vec4(mouse.y,0,0,1);
			return;
		}
		
		// line
		vec4 left = texture2D(backbuffer, (gl_FragCoord.xy+vec2(-3,0))/resolution);
		vec4 middle = texture2D(backbuffer, (gl_FragCoord.xy+vec2(0))/resolution);
		vec4 right = texture2D(backbuffer, (gl_FragCoord.xy+vec2(3,0))/resolution);
		
		// .r: position
		float p = middle.r;
		if(left.r + 3./256. < p) p -= 9./256.;
		if(right.r - 3./256. > p) p += 9./256.;
		if(left.r - 3./256. > p) p += 9./256.;
		if(right.r + 3./256. < p) p -= 9./256.;
		
		gl_FragColor = vec4((left.r+p+right.r)/3.,0,0,1);
		return;
	}
	
	// in the upper area, viz the data
	float y_target = texture2D(backbuffer, vec2(gl_FragCoord.x/resolution.x, 1./resolution.y)).r;
	gl_FragColor *= pow(abs(2.*(x.y-.5)-y_target), 2.);
	
	
}