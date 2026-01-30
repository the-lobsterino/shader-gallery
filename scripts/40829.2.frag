// extra changes by @xprogram

// lucy in minecraft with diamonds

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

     vec3 d = normalize(vec3((gl_FragCoord.xy - resolution.xy * .6) / resolution.x, .16));
	vec3 p, c, f, g=d, o, y=vec3(3.0,0.0,7.0);
	//motion
 	o.y = 30. - 4.8*sin((o.x=0.2)*(o.z=time * 40.0));
	//o.z = cos(o.y=0.5)*(o.z=time * 10.0);
	o.x -= -sin(time) - 6.0;

    for( float i=.0; i<6.; i+=.04 ) {
        f = fract(c = o += d*i*.1); 
	p = floor( c )*.6;
        if( tan(p.z) + tan(p.x) > ++p.y ) {
	    	g = (f.y-.05*cos((c.x+c.z)*6.)>.6?y:f.x*y.yxz) / i;
            break;
        } 
    }
    gl_FragColor = vec4(g,2.0);


}
