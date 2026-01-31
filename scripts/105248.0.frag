
#ifdef GL_ES
precision highp float;
#endif


uniform float time;
uniform vec2 resolution;


#define iTime time/2.
#define iResolution resolution


vec3 palette(float t) {
    vec3 a = vec3(0.5,0.5,0.5);
    vec3 b = vec3(0.5,0.5,0.5);
    vec3 c = vec3(2.0,1.0,0.0);
    vec3 d = vec3(0.5,0.20,0.25);
    return a + b*cos( 6.28318*(c*t+d) );
}


float disTri( in vec2 p, in float r )
{
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}

#define width 0.01
#define PI 3.14159265

vec2 getRotatedCoord(vec2 uv, float mul) {
    float dist = length(uv);
    float theta = atan(uv.x/uv.y);
    theta += iTime * mul;
    if(uv.y < 0.) {
        theta += PI;
    }
    return vec2(dist * cos(theta), dist * sin(theta));
}

vec4 getColForTriangleAt(vec2 uv, float size, float thickness, vec4 color) {

    float d = disTri(uv, size);
    d -= iTime/3.;
    //d = mod(d, 0.7);
    d = sin(d*4.)/4.;
    d = abs(d);
    d = thickness/d;
    color *= d;
    return vec4(color);

}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    // Normalized pixel coordinates (from -1 to 1) for a square res
    vec2 uv = (fragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
    vec4 col = vec4(0.000,0.000,0.000,0.0);
    col += getColForTriangleAt(getRotatedCoord(uv, 1.), 3., 0.01, vec4(1., 1., 1., 1.));
    col += getColForTriangleAt(getRotatedCoord(uv, -1.), 5., 0.01, vec4(1.000,0.239,0.239,1.));
    

    
    // Output to screen
    fragColor = vec4(col);
}


void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}