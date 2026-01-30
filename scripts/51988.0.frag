#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// Source: https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm

float sdPentagon( vec2 p, float r )
{
    const vec3 k = vec3(0.809016994,0.587785252,0.726542528); // pi/5: cos, sin, tan

    // reflections
    p.y = -p.y;
    p.x = abs(p.x);
    p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
    p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
    
    // side of polygon
    return length(p-vec2(clamp(p.x,-r*k.z,r*k.z),r))*sign(p.y-r);
}


void main( void ) {

	vec2 position = ( 2.0*gl_FragCoord.xy-resolution.xy) / resolution.y ;
	
	float d = sdPentagon(position, 0.4);
	
	vec3 color = vec3(1.0) - sign(d)*vec3(0.1,0.4,0.7);
	color *= 1.0 - exp(-4.0*abs(d));
	color *= 0.8 + 0.2*cos(140.0*d);
	color = mix( color, vec3(1.0), 1.0-smoothstep(0.0,0.015,abs(d)) );

	//float color = 0.0;
	//color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;
	if (position.x < (resolution.x - 960.0) && position.y > (resolution.y - 484.0)) {
		gl_FragColor = vec4(color, 1.0);
	}
	else if (position.x > (resolution.x - 960.0)) {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);	
	}
	else if (position.y < (resolution.y - 484.0)) {
		gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);	
	}
	else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
	}
	
	

	//gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}

