#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D s;

void main( void ) {
	
	float time = 1.;
	
	vec4 m = texture2D(s, vec2(0.));
	if(length(gl_FragCoord) < 10.){
		if(m.z > 0.92){
			m.x=mouse.x;
			m.y=mouse.y;
		}else if(distance(m.xy, mouse) > 0.05){
			m.z = 3.3*sqrt(distance(m.xy, mouse));
			m.x=mouse.x;
			m.y=mouse.y;
		}
		gl_FragColor = vec4(
			m.x
			, m.y
			, m.z-1./256.
			, 1.
		);
		return;
	}
	
	time = 1.+1.*sin(1.3*pow(m.z, 5e1));
	
	
	
	vec2 uv = (gl_FragCoord.xy*2.)/resolution.y-vec2(1.8,1);
	uv = uv.yx*2.;
	uv.y = mod(uv.y, 2.)-1.;
	
	gl_FragColor = vec4(float(abs(sin(atan(uv.x,uv.y)))/pow(length(uv),sin(time*5.)*5.+6.)<0.9));
	
	if(length(gl_FragColor) < 0.9){
		gl_FragColor = vec4(1,.75,.75,1);
		gl_FragColor *= 0.9+0.1*min(1.,pow(length(uv*vec2(1.2+0.2*sin(time*5.),1))*1.5, 1.5+sin(time*5.)*0.2));
		gl_FragColor *= 0.8+0.2*min(1.,pow(length(uv*vec2(1.5+0.5*sin(time*5.),1))*3., 3.+sin(time*5.)*1.));
		gl_FragColor += vec4(1,0,0,0)*0.001/min(1.,pow(length(uv*vec2(1.5+0.5*sin(time*5.),1))*3., 3.+sin(time*5.)*1.));
	}
	
	if(uv.x < 0.){
		gl_FragColor = vec4(.92)+.2*uv.x+0.08*gl_FragColor;
	}

}