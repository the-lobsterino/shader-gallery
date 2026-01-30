// extra changes by @xprogram

// Turbulance in minecraft (forked by nvd)

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	
	vec3 d = normalize(vec3((gl_FragCoord.xy - resolution.xy * 0.7) / resolution.x, .01));
	
	vec3 p, c, f, g=d, o, y=vec3(2.0,5.0,0.0);
	o.z = time * 200.0;
 	o.y = 10.2 * cos((2.5) * (o.z)) + 2.;
	o.x = 50.0 * sin(8.0 * time) * cos(8.0 * time) + 3.0;

    for ( float i=.0; i<18.; i+=.03 ) {
        f = fract(c = o += d*i*.08); 
	p = floor( c )*.05;
        
	if( cos(p.z) + sin(p.x) > ++p.y ) {
	    g = (f.y-.4*cos((c.x+c.z)*10.)>20.?y:f.x*y.yxz) / i;
            break;
        }
    }
    gl_FragColor = vec4(g, 1.);

}
