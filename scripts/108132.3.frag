#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


struct ellipse
{
    vec2 position;
    vec2 semi_axis;
};

struct polar
{
    float fi;
    float dist;
};

vec2 screen2uv(vec2 glCoord, vec2 glRes);
vec2 getAbsPosition(ellipse e, vec2 norm, float dist);
vec2 getAbsPosition(ellipse e, polar point);
bool contains(ellipse e, vec2 point);
bool contains(ellipse e, vec2 point, float scale);
void mainImage( out vec4 fragColor, in vec2 fragCoord );


vec2 screen2uv(vec2 glCoord, vec2 glRes)
{
    return 2.0 * (glCoord.xy - 0.5 * glRes.xy) / glRes.y; 
}

vec2 getAbsPosition(ellipse e, vec2 norm, float dist)
{
    return norm 
        * dist 
        * e.semi_axis
        + e.position;
}

vec2 getAbsPosition(ellipse e, polar point)
{
    return getAbsPosition(e, vec2(cos(point.fi), sin(point.fi)), point.dist);
}


float getIntensity(ellipse e, vec2 point)
{   
    vec2 pos = point - e.position;
    vec2 norm = normalize(pos);
    
    return length(pos) / length(norm * e.semi_axis);
}

bool contains(ellipse e, vec2 point)
{
    return contains(e, point, 1.0);
}

bool contains(ellipse e, vec2 point, float scale)
{
    vec2 res = (point - e.position) / e.semi_axis;
    return pow(res.x, 2.0) + pow(res.y, 2.0) <= pow(scale, 2.0);
}

void main() {

    vec2 uvFrag = screen2uv(gl_FragCoord.xy, resolution.xy);
    vec2 uvMouse = screen2uv(mouse.xy, resolution.xy);
    vec2 uvBounds = screen2uv(resolution.xy, resolution.xy);
    float currTime = time * 0.2;
	
    vec2 rtPos = vec2(cos(currTime), sin(currTime * 2.0));       
   
    ellipse ball = ellipse(rtPos, vec2(0.05));
    ball.position *= (uvBounds - ball.semi_axis);
    
    ellipse ballFlare = ellipse(
        getAbsPosition(ball, -rtPos, 0.5), 
        vec2(0.3)
    );
    
    vec3 flareColor = vec3(1.0);
    vec3 ballColor = vec3(255, 217, 46) / 255.0;
    vec3 backgroundColor = vec3(40, 39, 39) / 255.0;
    
   
    vec4 fragColor = vec4(backgroundColor, 1.0);

    if(contains(ball, uvFrag))
    {
        float ballIntensity = getIntensity(ball, uvFrag); 
        fragColor.rgb = mix(ballColor, fragColor.rgb, pow(ballIntensity, 8.0));
        
        if(contains(ballFlare, uvFrag))
        {
            float flareIntensity = getIntensity(ballFlare, uvFrag);
            fragColor.rgb = mix(flareColor, fragColor.rgb, pow(flareIntensity, 0.33));
        }
    }  
	
    gl_FragColor = fragColor;


}