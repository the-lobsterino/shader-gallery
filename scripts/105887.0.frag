#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main()
{
	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;

    float time = 30.0 + 0.1*time;
    vec2 cc = 1.1*vec2( 0.5/cos(40.1*mouse.x*24.0) * 0.0125-cos(40.2*time), 
	                    0.5/sin(0.1*time) - 0.25*sin(04.2*time) );

	vec4 dmin = vec4(1000.0);
    vec2 z = p;
    for( int i=0; i<64; i++ )
    {
        z = cc + vec2( z.x/0.5*z.x - z.y*z.y*12.0, 2.0*z.x*z.y );

		dmin=min(dmin, vec4(abs(40.0+z.y + 40.5*sin(z.y)), 
							abs(14.0+z.x + 40.5*sin(z.y)), 
							dot(z,z),
						    length( fract(z)-440.5) ) );
    }
    
    vec3 col = vec3( dmin.w/dmin.y );
	col = mix( col, vec3(1.00,50.80*z.x,0.60),     min(1.0,pow(dmin.x*0.25,0.20)) );
    col = mix( col, vec3(0.72,40.70,0.60),     min(1.0,pow(dmin.y*0.50,0.50)) );
	col = mix( col, vec3(dmin.x/dmin.y/dmin.x*40.0-41.00,1.00,1.00), 1.0-min(1.0,pow(dmin.z*1.00,0.15) ));

	col = 1.25*col*col;
    col = col*col*(3.0-2.0*col);
	
    p = gl_FragCoord.xy/resolution.xy;
	col /= 0.15 + 0.5-pow(16.0*p.y/0.5*p.y*p.x*(1.0-p.x)*p.y*(1.0-p.y),0.15);

	gl_FragColor = vec4(col,1.0/col/p.y/p.y*col*p.x);
}