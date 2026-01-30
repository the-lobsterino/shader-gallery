#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//based on https://www.shadertoy.com/view/MtSGWK by 104
// tweaked by inferno_op

float noise = 1.0;
float speed = 1.0;
float height = 1.0;
float gamma = 1.0;
float contrast = 1.5;
	
uniform vec2 lightPosXY;
uniform int aaSteps;

// exponent. higher=more regular-looking.
// 0 = turbulent and chaotic
// 5 starts to look quite regular (triangles tessellated in equal parts)
//float regularity = sin(time *0.000001 * speed) + noise;
float regularity = noise;

float initialVertexHeight = resolution.x * height;


// Real contrast adjustments by  Miles
vec3 adjust_contrast(vec3 col, vec4 con)
{
vec3 c = con.rgb * vec3(con.a);
vec3 t = (vec3(1.0) - c) / vec3(2.0);
t = vec3(.18);

col = (1.0 - c.rgb) * t + c.rgb * col;

return col;
}

varying vec2 surfacePosition;
// -------------------------------------------------------
// utilities
float rand(float n)
{
 	return fract(cos(n*89.42+cos((time+surfacePosition.y)*1e-4))*343.42);
}
vec2 rand(vec2 n)
{
 	return vec2(rand(n.x*23.62-300.0+n.y*34.35),rand(n.x*45.13+256.0+n.y*38.89)); 
}
vec3 rand(vec3 n)
{
 	return vec3(rand(n.xy), rand(n.z));
}
float rand1(vec2 n) {
	
  return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

vec4 applyLighting(vec4 inpColor, vec2 uv, vec3 normal, vec3 LightPos, vec4 LightColor, vec4 AmbientColor)
{
    if(distance(uv.xy, LightPos.xy) < 0.01) return vec4(1.,0.,0.,1.);
    vec3 LightDir = vec3(LightPos.xy - uv, LightPos.z);
    float D = length(LightDir);// distance for attenuation
    vec3 N = normalize(normal);
    vec3 L = normalize(LightDir);
    vec3 Diffuse = (LightColor.rgb * LightColor.a) * max(dot(N, L), 0.0);
    vec3 Ambient = AmbientColor.rgb * AmbientColor.a;
    vec3 Intensity = Ambient + Diffuse ;
    vec3 FinalColor = inpColor.rgb * Intensity;
    return vec4(FinalColor, inpColor.a);
}
vec3 calcNormalForTriangle(vec3 a, vec3 b, vec3 c)
{
    vec3 dir = cross(b - a, c - a);
	vec3 normal = normalize(dir);
    return normal;
}
float sgn(vec2 p1, vec2 p2, vec2 p3)
{
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}
bool IsPointInTriangle (vec2 pt, vec2 v1, vec2 v2, vec2 v3)
{
    bool b1, b2, b3;
    b1 = sgn(pt, v1, v2) < 0.0;
    b2 = sgn(pt, v2, v3) < 0.0;
    b3 = sgn(pt, v3, v1) < 0.0;
    return ((b1 == b2) && (b2 == b3)) ;
}


// -------------------------------------------------------
// the algorithm

// calculates the normal within the given triangle. iteration is done inside here.
// only call this if you know that uv is within the specified triangle.
vec3 getNormalForTopLevelTriangle(vec3 a, vec3 b, vec3 c, vec2 uv, out float debug, float startingHeight)
{
    // points come in with no height info, so generate them.
    a.z = rand1(a.xy);
    b.z = rand1(b.xy);
    c.z = rand1(c.xy);
    
    debug = 0.0;

    float heightChange = startingHeight;
    for(int i = 0; i < 12; ++ i)
    {
        float ab = distance(a,b);
        float bc = distance(b,c);
        float ca = distance(c,a);
        // split the longest segment in 2. we will first have to rotate the
        // triangle points so the longest segment is AB. makes subdividing easier later.
	    vec3 temp;
        if(ca > ab && ca > bc)
        {
            // ca is longest; rotate to CAB
            temp = c;
            c = b;
            b = a;
            a = temp;
        }
        else if(bc > ca && bc > ab)
        {
            // bc is longest; rotate to BCA
            temp = a;
            a = b;
            b = c;
            c = temp;
        }
        
        // find a random point between A and B, creating 2 new sub-triangles
        // favor the center of the segment. it makes sense because heightChange creates an angle you don't want to be too steep.
        float pos = rand(distance(a,b)) - 0.5;// from -0.5 to 0.5
        // very important: this pushes the point towards 0 (the center of the segment).
        // thus, the higher the exponent, the more things look like a triangle grid.
        pos = pow(pos, regularity) * 2.0;
        pos = (pos + 1.) / 2.0;// pos is now 0-1        
        vec3 d = mix(a, b, pos);
        d.z += heightChange * ((rand(pos) * 2.0) - 1.0);// find random height for the new point
        if(IsPointInTriangle(uv, a.xy, d.xy, c.xy))// triangle 1: ADC
            b = d;
        else// triangle 2: DBC
            a = d;

        // honestly i would expect 0.5 to work here but it really is way too subtle. i don't really understand why.
        heightChange *= 0.7;
    }
        
    return calcNormalForTriangle(b,c,a);
}


// -------------------------------------------------------

void main()
{
    vec2 uv = gl_FragCoord.xy;
    vec2 lightPosXY = mouse;

    vec4 col = vec4(vec3(0.5), 1.0);// background

    vec3 normal = vec3(0.);
    vec3 a, b, c;// triangle points

    // top-level rectangle size. we will manually divide the rect into 2 triangles.
    vec2 tileSize = resolution.xy / 1.0;
    //vec2 tilePosition = floor(uv / tileSize) * tileSize;// snap to grid of size
	vec2 tilePosition = floor(uv / tileSize) * tileSize;// snap to grid of size
    // the goal of everything here is to compute the normal of this fragment.
    // make sure these are clockwise for normal calculation
    a = vec3(tilePosition.x, tilePosition.y, 0.0);
    b = vec3(tilePosition.x+tileSize.x, tilePosition.y, 0.0);
    c = vec3(tilePosition.x, tilePosition.y+tileSize.y, 0.0);

	
    float debug1, debug2;
    if(IsPointInTriangle(uv, a.xy, b.xy, c.xy))
    {
    	normal = getNormalForTopLevelTriangle(a, b, c, uv, debug1, initialVertexHeight);
    }
    else
    {
        a = vec3(tilePosition.x+tileSize.x, tilePosition.y, 0.0);
        b = vec3(tilePosition.x+tileSize.x, tilePosition.y+tileSize.y, 0.0);
        c = vec3(tilePosition.x, tilePosition.y+tileSize.y, 0.0);
        normal = getNormalForTopLevelTriangle(a, b, c, uv, debug1, initialVertexHeight);
    }
    
    // lighting
    vec3 lightPos = vec3(lightPosXY, resolution.x / 2.);
    vec4 lightColor = vec4(1.0,1.0,1.0,1.);
    vec4 ambientColor = vec4(0.2,0.2,0.2,1.);
    col = applyLighting(col, uv, vec3(normal), lightPos, lightColor, ambientColor);
    col.rgb = pow(abs(col.rgb), vec3(1.0 / gamma));
    col.rgb = adjust_contrast(col.rgb, vec4(contrast));
    gl_FragColor = col;
}

