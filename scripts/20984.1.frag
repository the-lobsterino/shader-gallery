// GLSL Hadoken
// By: Brandon Fogerty
// bfogerty at gmail dot com

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

float makePoint( vec2 p, float size )
{
    vec2 origin = vec2( 0.0, 0.0 );
    vec2 d = origin - p;
    float dist = size / length( d );

    return dist;
}


vec3 gu( vec4 c0, vec4 c1, float dist )
{
    float t = abs(dist - c0.w) / abs(c1.w - c0.w);
    return mix( c0.xyz, c1.xyz, t);
}

vec3 grad( float dist )
{
    vec3 col = vec3( 0.0 );

    vec4 c0=vec4(0.0,0.0,0.0,0.00);
    vec4 c1=vec4(0.0,0.0,0.2,0.30);
    vec4 c2=vec4(0.0,0.0,0.3,0.55);
    vec4 c3=vec4(0.0,0.6,1.0,0.80);
    vec4 c4=vec4(1.0,1.0,1.0,1.00);

        
    if( dist < c1.w )
    {
        col = gu( c0, c1, dist );
    }
    else if( dist < c2.w )
    {
        col = gu( c1, c2, dist );
    }
    else if( dist < c3.w )
    {
        col = gu( c2, c3, dist );
    }
    else
    {
        col = gu( c3, c4, dist );
    }

    return col;
}

void main( void ) 
{

    vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    p.x *= resolution.x / resolution.y;

    vec3 color = vec3( 0.0 );

    float t = time * 0.70;
    float size = mix(0.05, 0.07, (sin(t)*0.5+0.5));
    for( float i = 0.0; i < 20.0; ++i )
    {
        float progress = ( i / 20.0 );

        float nx = cos(t+((i+1.0)*0.08)) * 0.60;
        float ny = sin(t+((i+1.0)*0.08)) * 0.60;

        float xx = cos(t+(i*0.08)) * 0.60;
        float yy = sin(t+(i*0.08)) * 0.60;

        float dx = nx - xx;
        float dy = ny - yy;

        vec3 fwd = vec3( dx, dy, 0.0 );
        vec3 up = vec3( 0.0, 0.0, 1.0 );
        vec3 right = normalize( cross( fwd, up ) );


        float pt = sin(t*i)*0.5+0.5;
        float off = mix( 0.03, 0.05, pt );
        vec2 newPos = p + vec2( xx , yy ) + (right.xy * off);
        float dist = makePoint( newPos , size );
        color += grad( dist );
        color *= pow(progress, 0.4); 
    }


    gl_FragColor = vec4( color, 1.0 );
}