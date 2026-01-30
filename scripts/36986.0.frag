// extra changes by @xprogram

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

     vec3 d = normalize(vec3((gl_FragCoord.xy - resolution.xy * .5) / resolution.x, .5));
	vec3 p, c, f, g=d, o, y=vec3(1.0,3.0,0.0);
 	o.y = 1.2*cos((o.x=0.3)*(o.z=time * 10.0));
	o.x -= sin(time) + 3.0;

    for( float i=.0; i<11.; i+=.05 ) {
        f = fract(c = o += d*i*.05); 
	p = floor( c )*.4;
        if( cos(p.z) + sin(p.x) > ++p.y ) {
	    	g = (f.y-.04*cos((c.x+c.z)*10.)>.7?y:f.x*y.yxz) / i;
            break;
        }
    }
    gl_FragColor = vec4(g,1.0);

}
