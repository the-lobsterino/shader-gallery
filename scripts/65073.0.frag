/*
 * Original shader from: https://www.shadertoy.com/view/td2yWR
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define PI 3.14

float circle( vec2 coord, float radius )
{
    return step(radius, length(coord));
}

float smoothcircle( vec2 coord, float radius, float blur )
{
    return smoothstep(radius*(1.-blur), radius*(1.+blur), length(coord));
}

float rect( vec2 coord, vec2 size )
{
    vec2 rect = step(abs(coord), size);
    return 1. - rect.x * rect.y;
}

mat2 rotate2d(float angle)
{
    return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

float rays(vec2 uv, float nbr)
{
	uv = uv * rotate2d(iTime * 1.5);
	float propeller = sin(atan(uv.y, uv.x) * nbr);
    return smoothstep(0., 0.1, propeller);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // - Normalize Coordinate -
    vec2 uv = -(2. * fragCoord - iResolution.xy) / iResolution.y;
    
    // - Set Background - 
    vec3 col = vec3(1.);

    // - Useful Functions -
    //col = vec3( length(uv) );									// length(coord)
    //col = vec3( step(uv.x + 0.5, sin(iTime)) );				// step(edge, source_value) => if (source_value > edge)
    //col = vec3( smoothstep(uv.x-0.2, uv.x+0.2, sin(iTime)) );	// step(lower_edge, upper_edge, source_value)
    
    // - Add Shapes -
    
    //Coords
    vec2 pos = uv + vec2(0.);
    
    //pos = uv + vec2(-0.8, 0.5);
    //col *= vec3( circle(pos, 0.3) );
    
    // Rays
    col.z = rays(uv, 20.);
    
    // Head
    pos = uv + vec2(0.);
    col *= vec3( smoothcircle(pos, 0.98, 0.005) );
    col += 1. - vec3( smoothcircle(pos, .88, 0.005) );
    
    // Eyes
    pos = uv * vec2(1.2, 1.) + vec2(0. + 0.05 * cos(4.*iTime), 0.43 + 0.05 * sin(4.*iTime));
    vec2 new_pos = vec2(0.);
    float delta = 0.5;
    
    // Eye Left
    new_pos = pos + vec2(delta, 0.);
    col *= vec3( smoothcircle(new_pos, 0.3, 0.01) );
    col += 1. - vec3( smoothcircle(new_pos, 0.23, 0.01) );
    
    new_pos += 0.15 * vec2(cos(iTime), sin(iTime));
    col *= vec3( smoothcircle(new_pos, 0.1, 0.01) );
    
    
    // Eye Right
    new_pos = pos + vec2(-delta, 0.);
    col *= vec3( smoothcircle(new_pos, 0.3, 0.01) );
    col += 1. - vec3( smoothcircle(new_pos, 0.23, 0.01) );
    
    new_pos += 0.15 * vec2(cos(-iTime + PI), sin(-iTime + PI));
    col *= vec3( smoothcircle(new_pos, 0.1, 0.01) );
    
    // Nose
    pos = uv + vec2(0., -0.05);
    col *= vec3( rect(pos, vec2(0.05, 0.2)) );
    col *= vec3( rect(pos, vec2(0.2, 0.05)) );
    
    // Mouth
    pos = uv + vec2(0., -0.45 + 0.05*cos(2.*iTime));
    col *= vec3( rect(pos, vec2(0.2, 0.05)) );
    
    pos = uv + vec2(0., -0.65 + 0.05*sin(2.5*iTime/2.0));
    col *= vec3( rect(pos, vec2(0.2, 0.05)) );

    // - Output -
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}