/*
 * Original shader from: https://www.shadertoy.com/view/DllXWn
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
mat2 rotate2d(float angle)
{
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
}

float sqr(float x)
{
    return x * x;
}

// SDF for grid with separate values for the horizontal and vertical bars
vec2 sdGridSep(vec2 pt, vec2 ptGridCenter, float gridAngle, float gridCellWidth, float barWidth)
{
    // Transform from world to grid
    pt -= ptGridCenter;
    pt *= rotate2d(-gridAngle);
    
    return abs(mod(pt, gridCellWidth) - 0.5 * gridCellWidth) - 0.5 * barWidth;
}

// SDF for grid of discs
float sdDiscGrid(vec2 pt, vec2 ptGridCenter, float gridAngle, float gridCellWidth, float circleRadius)
{
    // Transform from world to grid
    pt -= ptGridCenter;
    pt *= rotate2d(-gridAngle);
    
    return length(mod(pt, gridCellWidth) - 0.5 * gridCellWidth) - circleRadius;
}

// SDF for grid of discs
float sdAnnulusGrid(vec2 pt, vec2 ptGridCenter, float gridAngle, float gridCellWidth, float circleRadius, float circleWidth)
{
    // Transform from world to grid
    pt -= ptGridCenter;
    pt *= rotate2d(-gridAngle);
    
    return abs(length(mod(pt, gridCellWidth) - 0.5 * gridCellWidth) - circleRadius) - 0.5 * circleWidth;
}

vec2 HexAxialRound(vec2 pt)
{
    // https://observablehq.com/@jrus/hexround
    vec2 ptGrid = round(pt);
    pt -= ptGrid;
    if (abs(pt.x) > abs(pt.y))
        ptGrid.x += round(pt.x + 0.5*pt.y);
    else
        ptGrid.y += round(pt.y + 0.5*pt.x);
    return ptGrid;
}

#define SQRT3 (1.7320508)
#define INVSQRT3 (0.57735027)

// (grid cell x, grid cell y, dist to cell center)
vec3 HexGrid(vec2 pt, float cellWidth)
{
    pt *= 1.0 / cellWidth;
    // To axial              From axial 
    // | 1  -1/sqrt(3) |     | 1  1/2       |
    // | 0   2/sqrt(3) |     | 0  sqrt(3)/2 |
    vec2 ptAxial = vec2(pt.x - INVSQRT3 * pt.y, 2.0 * INVSQRT3 * pt.y);
    ptAxial = HexAxialRound(ptAxial);
    vec2 ptCellCenter = vec2(ptAxial.x + 0.5 * ptAxial.y, 0.5 * SQRT3 * ptAxial.y);
    return vec3(ptAxial.x, ptAxial.y, cellWidth * distance(pt, ptCellCenter));
}

// SDF for grid of discs
float sdAnnulusHexGrid(vec2 pt, vec2 ptGridCenter, float gridAngle, float gridCellWidth, float circleRadius, float circleWidth)
{
    // Transform from world to grid
    pt -= ptGridCenter;
    pt *= rotate2d(-gridAngle);
    
    vec3 hex = HexGrid(pt, gridCellWidth);
    
    return abs(hex.z - circleRadius) - 0.5 * circleWidth;
}

// Converts color and signed distance to a "bleed value",
// Bleed value takes the signed dist interval [0, bleedDist], reverses it, scales it to [0, 1] with clamping, and squares it.
// The color is weighted by the bleed value.
// Bleed values can be added and in the end converted back to color
vec4 BleedVal(vec3 col, float sd, float bleedDist)
{
    float b = sqr(clamp((bleedDist - sd) / bleedDist, 0.0, 1.0));
    return vec4(b * col, b);
}

vec3 BleedToCol(vec4 bleedVal, float bleedDist, float fadeDist)
{
    vec3 col = bleedVal.xyz / bleedVal.w;
    
    float sd = bleedDist - sqrt(bleedVal.w) * bleedDist;
    
    col *= smoothstep(fadeDist, 0.0, sd);
    
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from -1 to 1 in the longest axis, square units)
    vec2 pt = (2.0 * fragCoord - iResolution.xy) / max(iResolution.x, iResolution.y);
    // Normalized pixel coordinates (from -1 to 1 in x and y)
    vec2 ptS = (2.0 * fragCoord - iResolution.xy) / iResolution.xy;

    // Bleed SDFs together
    const float bleedDist = 0.04;
    const float fadeDist = 0.003;
    const float LineWidth = 0.01;

    vec4 bleed = vec4(0.0, 0.0, 0.0, 0.0);

    vec2 grid1 = sdGridSep(pt, vec2(0.5 * cos(iTime * 0.023), sin(iTime * 0.017)), iTime * 0.03, 0.3, LineWidth);
    vec3 grid1col = vec3(1.0, 0.0, 1.0);
    bleed += BleedVal(grid1col, grid1.x, bleedDist);
    bleed += BleedVal(grid1col, grid1.y, bleedDist);

    vec2 grid2 = sdGridSep(pt, vec2(0.5 * cos(iTime * 0.013), sin(iTime * 0.027)), -iTime * 0.02, 0.4, LineWidth);
    vec3 grid2col = vec3(0.0, 1.0, 1.0);
    bleed += BleedVal(grid2col, grid2.x, bleedDist);
    bleed += BleedVal(grid2col, grid2.y, bleedDist);

    //float grid3 = sdDiscGrid(pt, vec2(0.5 * cos(iTime * 0.033), sin(iTime * 0.025)), iTime * 0.01, 0.5, 0.125);
    //float grid3 = sdAnnulusGrid(pt, vec2(0.5 * cos(iTime * 0.033), sin(iTime * 0.025)), iTime * 0.01, 0.5, 0.15, 0.04);
    float grid3 = sdAnnulusHexGrid(pt, vec2(0.5 * cos(iTime * 0.033), sin(iTime * 0.025)), iTime * 0.01, 0.5, 0.15, LineWidth);
    vec3 grid3col = vec3(1.0, 1.0, 0.0);
    bleed += BleedVal(grid3col, grid3, bleedDist);

    float grid4 = sdDiscGrid(pt, vec2(0.5 * cos(iTime * 0.013), sin(iTime * 0.027)), -iTime * 0.04, 0.2, 0.005);
    vec3 grid4col = vec3(1.0, 1.0, 1.0);
    bleed += BleedVal(grid4col, grid4, bleedDist);


    vec3 col = BleedToCol(bleed, bleedDist, fadeDist);

    // Fade out at the edges
    col *= smoothstep(1.5, 0.8, length(ptS)); // round fade
    col *= smoothstep(1.2, 0.7, max(abs(ptS.x), abs(ptS.y))); // rect fade

    // Output to screen
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}