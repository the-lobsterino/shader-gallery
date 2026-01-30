// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// by @joat_es (http://joat.es)

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14592;
float t = max(2.95,mod(-time*0.5,PI));

float map(in vec3 pos) {
	float d1 = length(pos) - 1.0;

	vec2  h  = vec2(0.21, 0.04);
	vec2  d  = abs( vec2( length( vec2( pos.x*cos(t)+pos.z*sin(t)+0.32, pos.y )), 1.0+pos.z*cos(t)-pos.x*sin(t))) - h;
	float d2 = min( max(d.x,d.y), 0.0) + length( max(d, 0.01));

	vec3  it = vec3(0.05, 0.14, 0.025);
	float d3 = length( max( abs( vec3(pos.x*cos(t)+pos.z*sin(t), pos.y+0.04, 1.0+pos.z*cos(t)-pos.x*sin(t)) ) - it, 0.0));

	vec3  ib = vec3(0.05, 0.025, 0.025);
	float d4 = length( max( abs( vec3(pos.x*cos(t)+pos.z*sin(t), pos.y-.14, 1.0+pos.z*cos(t)-pos.x*sin(t)) ) - ib, 0.0));
	
	return min( min( min(d1,d2), d3), d4 );
}

vec3 calcNormal( in vec3 pos ) {
    vec2 e = vec2( 0.0001, 0.0 );
    return normalize( vec3( map( pos + e.xyy ) - map( pos - e.xyy ),
                            map( pos + e.yxy ) - map( pos - e.yxy ),
                            map( pos + e.yyx ) - map( pos - e.yyx ) ) );
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution;
	vec2 pos = -1.0+2.0*uv;
	pos.x *= resolution.x / resolution.y;

	vec3 ro = vec3( 0.0, 0.0, 2.0 );
	vec3 rd = normalize( vec3( pos, -1.0 ) );
    
	vec3 col = vec3( 0.0 );

        float tmax = 20.0;
        float h = 1.0;
        float t = 0.0;
        for( int i = 0; i < 100; i++ ) {
            if( h < 0.0001 || t > tmax ) break;
            h = map( ro + t*rd );
            t += h;
        }

        vec3 light = vec3( 0.5773 );

        if ( t > tmax ) {
	    vec3 m = col;

	    float dSq = 1.9*dot( pos.xy, pos.xy );
	    if ( dSq > .00012 ) {
		float d	=  sqrt( dSq );
		m	=  mix( vec3( 1.0 ), vec3( 0.1, 0.33, 1.0 ), smoothstep( 0.4, 1.0, d ) );
		m	+= mix( m, vec3( 0.0, 0.02, 0.2 ), smoothstep( 0.8, 1.2, d ) );
		m	*= dot( rd, light ) * 0.5 + 1.;
		m	*= smoothstep( 1., 0.9, sqrt( d ) );
	    }
	
	    col = vec3(clamp( m, 0.0, 1.0 ));

	} else {
		
	    vec3 pos = ro + t*rd;
            vec3 normal = calcNormal( pos );

            col  = vec3( 0.25, 0.6, 0.95 ) * clamp( dot( normal, light ), 0.0, 1.0 );
            col += vec3( 0.2, 0.3, 0.4 ) * clamp( normal.y, 0.0, 1.0 );
            col += 0.1;

	    col += vec3( 1.0, 0.5, 0.0 ) * clamp( 1.0 + dot( rd,normal ), 0.0, 1.0 );
        }

	// gamma
	col = pow(col, vec3(0.75));

	gl_FragColor = vec4( col, 1.0 );
}