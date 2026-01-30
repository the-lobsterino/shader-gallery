#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// RoundedSquare.glsl

const vec3 outerColor = vec3(1.0, 0.8, 0.2);
const vec3 innerColor = vec3(1.0, 0.3, 0.2);


float quad(vec2 position, vec2 size)
{
  return length(max(abs(position) - size, 0.0));
}

float roundedQuad(vec2 position, vec2 size, float radius)
{
  return length(max(abs(position) - (size * (1.0 - radius)), 0.0)) - radius;
}

float contour(in float dist, in float w) 
{
    return smoothstep(0.98 - w, 0.98 + w, dist);
}

float createOuterEdge(vec2 position, vec2 size)
{
	float s0 = quad(position, size);
    float dist = exp(-s0 * 100.0);
    float width = fwidth(dist);
    return clamp(contour(dist, width), 0.0, 1.0);
}

float createInnerEdge(vec2 position, vec2 size, float radius)
{
	float s0 = 1.0 - roundedQuad(position, size, radius);
    float dist = s0;
    float width = fwidth(dist);
    return clamp(contour(dist, width), 0.0, 1.0);    
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // get uv position with origin at window center
    vec2 uv = fragCoord.xy / resolution.xy;
    float aspect = resolution.x / resolution.y;
    vec2 ratio = vec2(aspect, 1.0);
    uv = (2.0 * uv - 1.0) * ratio;

    uv *= 2.4+sin(time); // scale

    float ra = time*0.12;  // rotate
    float cost = cos(ra);      
    float sint = sin(ra);
    uv = vec2(cost*uv.x + sint*uv.y, sint*uv.x - cost*uv.y);

    float outerEdge = createInnerEdge(uv, vec2(1.0, 1.0), 0.2);
    float innerEdge = createInnerEdge(uv, vec2(0.9, 0.9), 0.1);
   
    vec3 col = vec3(0.0);
    col += outerColor * (outerEdge - innerEdge);
    col += innerColor * (innerEdge);
    
    fragColor = vec4(col, 1.0);
}

void main( void )   
{
  mainImage(gl_FragColor, gl_FragCoord.xy );   
}