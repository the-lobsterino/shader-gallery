#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
#define A5
const vec4 iMouse = vec4(0.0);


const float zoomSpeed			= 1.0;
const float zoomScale			= 0.1;
const int recursionCount		= 5;
const float recursionFadeDepth	= 2.0;	
const int glyphSize			= 5;
const int glyphCount			= 2;
const float glyphMargin			= 0.5;

int GetGlyphPixel(ivec2 pos, int g)
{
	if (pos.x >= glyphSize || pos.y >= glyphSize)
		return 0;
    
    if (g == 0)
    {
     	if (pos.x > 0 && pos.x < 4 && (pos.y == 0 || pos.y == 4))
            return 1;
     	if (pos.y > 0 && pos.y < 4 && pos.x != 2)
            return 1;
  	    return 0;
    }
    else
    {
        if (pos.x == 0 && (pos.y == 4 || pos.y == 2 || pos.y == 1))
            return 0;
        if (pos.x == 4 && pos.y > 0)
            return 0;
        return 1;
    }
    
    return 0;
}

const float glyphSizeF = float(glyphSize) + 2.0*glyphMargin;
const float glyphSizeLog = log(glyphSizeF);
const float gsfi = 1.0 / glyphSizeF;
const float e = 2.718281828459;
const float pi = 3.14159265359;

float RandFloat(int i) { return (fract(sin(float(i)) * 43758.5453)); }
int RandInt(int i) { return int(100000.0*RandFloat(i)); }


float GetRecursionFade(int r, float timePercent)
{
    if (r > recursionCount)
        return timePercent;
    
    // fade in and out recusion
    float rt = max(float(r) - timePercent - recursionFadeDepth, 0.0);
    float rc = float(recursionCount) - recursionFadeDepth;
    return rt / rc;
}

vec3 InitPixelColor() { return vec3(0); }
vec3 CombinePixelColor(vec3 color, float timePercent, int i, int r, vec2 pos, ivec2 glyphPos, ivec2 glyphPosLast)
{
    vec3 myColor = vec3(1.0);
        
    myColor.r *= mix(0.3, 1.0, RandFloat(i + r + 11*glyphPosLast.x + 13*glyphPosLast.y));
    myColor.b *= mix(0.3, 1.0, RandFloat(i + r + 17*glyphPosLast.x + 19*glyphPosLast.y));
    myColor *= mix(0.2, 0.7, RandFloat(i + r + 31*glyphPosLast.x + 37*glyphPosLast.y));


    float f = GetRecursionFade(r, timePercent);
    color += myColor*f;
    return color;
}

vec3 FinishPixel(vec3 color, vec2 uv)
{

    color += vec3(0.05);
    

    color *= vec3(0.7, 1.0, 0.7);
    return color;
}

vec2 InitUV(vec2 uv)
{
	// wave
	uv.x += 0.1*sin(2.0*uv.y + 1.0*iTime);
	uv.y += 0.1*sin(2.0*uv.x + 0.8*iTime);
    return uv;
}



int imod(int a, int b) { return int(mod(float(a), float(b))); }
int GetFocusGlyph(int i) { return imod(RandInt(i), glyphCount); }

ivec2 CalculateFocusPos(int iterations)
{

    int g = GetFocusGlyph(iterations-1);
    int c = 18;

    c -= imod(RandInt(iterations), c);
    for (int y = 0; y < glyphSize; ++y)
    for (int x = 0; x < glyphSize; ++x)
    {
            c -= GetGlyphPixel(ivec2(x, y), g);
            if (c == 0)
                return ivec2(x, y);
    }
    
    return ivec2(0);
}
  
ivec2 GetFocusPos(int i) { return CalculateFocusPos(i); }

int GetGlyph(int iterations, ivec2 glyphPos, int glyphLast, ivec2 glyphPosLast, ivec2 focusPos)
{ 
    if (glyphPos == focusPos)
        return GetFocusGlyph(iterations); 
            
    int seed = iterations + glyphPos.x * 313 + glyphPos.y * 411 + glyphPosLast.x * 557 + glyphPosLast.y * 121;
    return imod(RandInt(seed), glyphCount); 
}

vec3 GetPixelFractal(vec2 pos, int iterations, float timePercent)
{
    int glyphLast = GetFocusGlyph(iterations-1);
	ivec2 glyphPosLast = GetFocusPos(iterations-2);
	ivec2 glyphPos =     GetFocusPos(iterations-1);
    
	bool isFocus = true;
    ivec2 focusPos = glyphPos;
    
	vec3 color = InitPixelColor();
	for (int r = 0; r <= recursionCount + 1; ++r)
	{
        color = CombinePixelColor(color, timePercent, iterations, r, pos, glyphPos, glyphPosLast);
        
        if (r > recursionCount)
	return color;
  
        pos -= vec2(glyphMargin*gsfi);
        pos *= glyphSizeF;

        glyphPosLast = glyphPos;
        glyphPos = ivec2(pos);

        int glyphValue = GetGlyphPixel(glyphPos, glyphLast);
		if (glyphValue == 0 || pos.x < 0.0 || pos.y < 0.0)
			return color;

		pos -= vec2(floor(pos));
        focusPos = isFocus? GetFocusPos(iterations+r) : ivec2(-10);
        glyphLast = GetGlyph(iterations + r, glyphPos, glyphLast, glyphPosLast, focusPos);
        isFocus = isFocus && (glyphPos == focusPos);
	}
	return color;
}
	
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

	vec2 uv = fragCoord;
	uv = fragCoord / iResolution.y;
	uv -= vec2(0.5*iResolution.x / iResolution.y, 0.5);
    uv = InitUV(uv);

	float timePercent = iTime*zoomSpeed;
	int iterations = int(floor(timePercent));
	timePercent -= float(iterations);

	float zoom = pow(e, -glyphSizeLog*timePercent);
	zoom *= zoomScale;

	vec2 offset = vec2(0);
	for (int i = 0; i < 13; ++i)
		offset += ((vec2(GetFocusPos(iterations+i)) + vec2(glyphMargin)) * gsfi) * pow(gsfi, float(i));

    vec2 uvFractal = uv * zoom + offset;

	vec3 pixelFractalColor = GetPixelFractal(uvFractal, iterations, timePercent);
    pixelFractalColor = FinishPixel(pixelFractalColor, uv);

	fragColor = vec4(pixelFractalColor, 1.0);
}


void main(void)
{
//iMouse = vec4(mouse * resolution, 0.0, 0.0);    
mainImage(gl_FragColor, gl_FragCoord.xy);
gl_FragColor.a = 1.0;
}