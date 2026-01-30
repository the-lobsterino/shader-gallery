#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 bubbles [4];
float border = 0.005;
vec4 color = vec4(.4, .7, .2, 1.0);
vec4 bkg_color = vec4(0., 0., 0., 1.0);

void main( void ) {
	bubbles[0] = vec3(0.2,0.4,0.05);
	bubbles[1] = vec3(0.4,0.1,0.1);
	bubbles[2] = vec3(0.981777,0.228294,0.08);
	bubbles[3] = vec3(.0,0.0,0.0);
	
        vec2 uv = gl_FragCoord.xy;
        uv.x /= resolution.y;
        uv.y /= resolution.y;
        vec4 col = vec4(0.,0.,0.,0.);
	for ( int i = 0; i < 99 ; i++)
	{
		if ( bubbles[i].z == 0.)
			break;
        	vec2 c = bubbles[i].xy;
        	float r = bubbles[i].z;
        	vec2 xy = uv - c;
          	float d =  sqrt(dot(xy, xy));
		float t = smoothstep(r+border, r-border, d);
		col = mix(bkg_color,color,t);
		
	}

	gl_FragColor = col;

}