#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	
	vec2 persp = vec2(1.0, 2.0);

	vec2 pos = (gl_FragCoord.xy-(resolution / 2.0))* persp;;
	
	
	vec2 mos = ((mouse * resolution) - resolution /2.0 )*persp;
	
	//pos = pos - mos*2.0;
	
	vec2 pr = pos;
	
	float theta = time/4.0;
		
	pos.x  = pr.x * cos(theta) - pr.y*sin(theta);
	pos.y = pr.x*sin(theta)+pr.y*cos(theta);
	
	
	
	float d = distance(pos, vec2(0.0, 0.0));
	
	vec2 p = pos; // normalize(pos);
	
	
	float displace = (sin(time*2.0 + (d/100.0)))*30.0;
	float shadow = (cos(time*2.0 + (d/100.0)));
	
	pos = pos - (displace*vec2(0.0, 2.0));

	
	
	vec2 uv = floor(pos / 32.0);
	
	
	float r,g,b=0.0;
	b=0.1;	
	if (mod(uv.x + mod(uv.y, 2.0), 2.0) == 0.0)
	{
		b = 0.8;
	}

	
	float w = b - (1.0-shadow)/4.0;
	
	

	gl_FragColor = vec4(w,  w, w, 0.0);

}