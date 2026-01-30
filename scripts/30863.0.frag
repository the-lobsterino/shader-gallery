#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define MAX_NO 36

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ; // v_texCoord
	vec2 p = position * 8.0 - vec2(20.0);
	vec2 i = p;
	float c = 5.0;
	float inten = 0.06;
	vec4 color=vec4(0.1, 0.19, 0.29, 1.0);
	float wave=cos((position.x +0.2*time )*12.0)*0.02;
	float r=0.25+wave;

// GENERATE THE TEXTURE EFFECT BASED UPON THE COLOURS AND THE ANIMATED FEEL	
        for (int n = 0; n < MAX_NO; n++)
	{
		float t = time * (0.05 - (3.0 / float(n+1)));
		
		i = p + vec2(cos(t - i.x) + sin(t+ i.y),
			     sin(t - i.y) + cos(t + i.x));
		
		c += 0.8/length(vec2(p.x / (sin(i.x+t)/inten),
                p.y / (cos(i.y+t)/inten)));
	}
            c /= float(MAX_NO);
            c = 1.4 - sqrt(c);
	
	
// MAKE THE WAVE AND WATER COLOUR EFFECT MERGE AND DISPLAY
        color*=(1.0- smoothstep( r,r+0.01,position.y +0.3*cos(time)) );//waves
	color.rgb *= (0.4 / (1.0 - (c + 0.005)));
	gl_FragColor = vec4( color );

}