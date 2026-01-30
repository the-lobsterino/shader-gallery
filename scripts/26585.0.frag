// By @eddbiddulph
//
// This is the backdrop to the opening scene from the cult classic computer game Another World.
// This image was originally designed and implemented by Eric Chahi. I recreated it by
// modifying the reverse-engineered Another World source code available at
// http://fabiensanglard.net/anotherWorld_code_review/index.php.
// In the process I ran up against constant data storage limitation, instruction
// count limitation, and graphics driver reset convulsions. 
//
// Note that (much to my annoyance) not every element of the backdrop is present. This is because
// either my driver or glslsandbox will not accept a shader much bigger than this one.
//
// Chahi's rasterization algorithm is simple to understand once you realize that it
// is NOT a generalized polygon renderer...
//
// Please visit http://www.anotherworld.fr/anotherworld_uk/index.htm

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;

// return 1.0 when e0 < x < e1, otherwise return 0.0
float box(float e0, float e1, float x)
{
    return step(e0, x) - step(e1, x);
}

// return 1.0 when p is within a given trapezium, otherwise return 0.0
float section(  float y0, float y1, float dxdy0, float dxdy1,
                float x0_ofs, float x1_ofs, vec2 p)
{
    float x0 = dxdy0 * p.y + x0_ofs, x1 = dxdy1 * p.y + x1_ofs;
    return box(y0, y1, p.y) * box(x0, x1, p.x);
}

void main()
{
    vec3 palette[16];
    
    palette[0] = vec3(0.063, 0.063, 0.063);
    palette[1] = vec3(0.540, 0.000, 0.000);
    palette[2] = vec3(0.063, 0.127, 0.270);
    palette[3] = vec3(0.063, 0.190, 0.333);
    palette[4] = vec3(0.127, 0.270, 0.397);
    palette[5] = vec3(0.190, 0.333, 0.460);
    palette[6] = vec3(0.333, 0.460, 0.603);
    palette[7] = vec3(0.460, 0.667, 0.730);
    palette[8] = vec3(0.730, 0.540, 0.000);
    palette[9] = vec3(1.000, 0.000, 0.000);
    palette[10] = vec3(0.810, 0.603, 0.000);
    palette[11] = vec3(0.873, 0.667, 0.000);
    palette[12] = vec3(0.937, 0.810, 0.000);
    palette[13] = vec3(1.000, 0.937, 0.000);
    palette[14] = vec3(1.000, 1.000, 0.460);
    palette[15] = vec3(1.000, 1.000, 0.667);

    vec2 tex_resolution = vec2(320.0, 200.0);
    vec2 position = gl_FragCoord.xy * tex_resolution / resolution;
    position.y = tex_resolution.y - position.y; // flip image

    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    gl_FragColor.rgb = palette[2]; // hacked-in background colour

    // polygon 5
    // numPoints = 4
    float mask = section(20.000000, 121.000000, 0.000000, 0.000000, 65.000000, 320.000000, position);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, palette[3], mask);

	
     vec2 p = gl_FragCoord.xy/resolution.xy;
     gl_FragColor.rgb += .01;
}