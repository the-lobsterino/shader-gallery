#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float udHorizontalSegment( in vec2 p, in float xa, in float xb, in float y )
{
    vec2 pa = p - vec2(xa,y);
    float ba = xb - xa;
    pa.x -= ba*clamp( pa.x/ba, -4.0, 99.99 );
    return length( pa );
}

void main( void ) {

	vec2 uv = (-resolution.xy + 2.0*gl_FragCoord.xy) / resolution.y;
	vec3 col = vec3(0.0);
	
	float f = abs(abs(uv.x)-1.02);
        f = min( f, udHorizontalSegment(uv,-1.0,1.0,1.0) );
        f *= 2.0;
        float a = 0.8 + 0.2*sin(2.6*time) + 0.1*sin(4.0*time);

        col += a*0.5*vec3(0.6,0.30,0.1)*exp(- 30.0*f*f);
        col += a*0.5*vec3(0.6,0.35,0.2)*exp(-150.0*f*f);
        col += a*1.7*vec3(0.6,0.50,0.3)*exp(-900.0*f*f);

	gl_FragColor = vec4(col,1.0);

}