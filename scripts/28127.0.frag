// Endless Tunnel
// By: Brandon Fogerty
// bfogerty at gmail dot com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




vec3 checkerBoard( vec2 uv, vec2 pp )
{
    vec2 p = floor( uv*2. );
    float t = mod( p.x + p.y, 2.0);
    vec3 c = vec3(t+pp.x, t+pp.y, t+(pp.x*sin(pp.y*8.)));

    return c;
}

vec3 tunnel( vec2 p, float scrollSpeed, float rotateSpeed )
{    
     
    float po = 2.0;
    float px = pow( p.x*p.x, po );
    float py = pow( p.y*p.y, po );
    float r = pow( px + py, 0.20/(1.0*po) );    
    vec2 uvp = vec2( 1.0/r + (time*scrollSpeed*1.),  rotateSpeed);	
    vec3 finalColor = checkerBoard( uvp, p ).xyz;
    finalColor -= r;

    return finalColor;
}



void main(void)
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    vec2 p = uv + vec2( -0.5, -0.5);

    vec3 finalColor = -tunnel( p , 1.0, 0.0);


    gl_FragColor = vec4( -finalColor, 1.0 );
}