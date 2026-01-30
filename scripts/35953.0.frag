//http://glslsandbox.com/e#35869.2
#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform vec2 mouse;
uniform float time;
uniform sampler2D heightmap;
 
float trace() {//vec2 light, vec4 surface
    return 1.0;
}
 
float norm(vec2 a) {
    return sqrt(a.x*a.x + a.y*a.y);
}
 
float calcDistance(vec2 a, vec2 b) {
    return norm(a - b);
}
 
vec2 perpendicular(vec2 a ) {
    return vec2(-a.y, a.x);
}
 
 
uniform vec2 resolution;
 
float cross2(vec2 a, const vec2 b) {
  return a.x * b.y - a.y * b.x;
}
 
float rand(float n)
{
  return (0.5 * fract(sin(n * 78.233)* 43758.5453)) - 0.25;
}
 
bool trace(vec2 light_p1, vec2 light_p2, vec2 surface_p1, vec2 surface_p2) {
 
    float light_xMin = min(light_p1.x, light_p2.x);
    float light_yMin = min(light_p1.y, light_p2.y);
    float light_xMax = max(light_p1.x, light_p2.x);
    float light_yMax = max(light_p1.y, light_p2.y);
    vec2 light_delta = light_p2 - light_p1;
    vec2 light_deltaPerp = perpendicular(light_delta);
 
    float surface_xMin = min(surface_p1.x, surface_p2.x);
    float surface_yMin = min(surface_p1.y, surface_p2.y);
    float surface_xMax = max(surface_p1.x, surface_p2.x);
    float surface_yMax = max(surface_p1.y, surface_p2.y);
    vec2 surface_delta = surface_p2 - surface_p1;
 
    float denom = dot(light_deltaPerp, surface_delta);
 
    if (denom < 1.0 && denom > -1.0) {
        return true;
    }
 
    vec2 dp = light_p1 - surface_p1;
 
    float temp = (dot(light_deltaPerp, dp) / denom);
    vec2 mRes = vec2(temp, temp);
    vec2 point = mRes * surface_delta + surface_p1;
 
    if (surface_xMin <= point.x) {
        if (point.x <= surface_xMax) {
            if (surface_yMin <= point.y) {
                if (point.y <= surface_yMax) {
                    if (light_xMin <= point.x) {
                        if (point.x <= light_xMax) {
                            if (light_yMin <= point.y) {
                                if (point.y <= light_yMax) {
                                    float crossproduct = cross2(surface_delta, point - surface_p1);
                                    if (-0.01 < crossproduct) {
                                        if (crossproduct < 0.01) {
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
 
    return true;
}
 
    vec2 surfaces[10];
    vec3 lightSources[5];
void main( void ) {
    surfaces[0] = vec2(192., 192.);
    surfaces[1] = vec2(128., 64.);
    surfaces[2] = vec2(192., 192.);
    surfaces[3] = vec2(64., 128.);
    surfaces[4] = vec2(256., 64.);
    surfaces[5] = vec2(256., 400.);
    surfaces[6] = vec2(450., 64.);
    surfaces[7] = vec2(450., 400.);
    surfaces[8] = vec2(900., 400.);
    surfaces[9] = vec2(600., 650.);


    lightSources[0] = vec3(64., 64., 128.);
    lightSources[1] = vec3(192., 192., 64.);
    lightSources[2] = vec3(384., 384., 16.);
    lightSources[3] = vec3(mouse.x*resolution.x, (-mouse.y*resolution.y)+resolution.y, 50.);
    lightSources[4] = vec3(800., 400., 32.);
    
    vec2 position = vec2(gl_FragCoord.x, -gl_FragCoord.y+resolution.y);
    vec2 surface_p1 = vec2(500, 600);
    vec2 surface_p2 = vec2(500, 300);
    float lampSize = 0.;
    float brightness = 0.;
    bool miss = true;
    vec2 rndLightPos = vec2(0., 0.);
    vec2 light = vec2(0., 0.);
	float npX, npY;

    
        light = lightSources[3].xy;
        lampSize = lightSources[3].z*2.;
        
            npX = rand(cos(gl_FragCoord.x*gl_FragCoord.y));
            npY = rand(sin(gl_FragCoord.x*gl_FragCoord.y));
    
            rndLightPos = light+vec2(npX, npY)*lampSize;
            for(int surfN=0; surfN<10; surfN+=2) {
                surface_p1 = surfaces[surfN];
                surface_p2 = surfaces[surfN+1];
                if (!trace(position, rndLightPos, surface_p1, surface_p2)) {
                    miss = false;
                }
            
            }
            if (miss) {
                brightness += (lampSize/(calcDistance(rndLightPos, position)))*0.5;
            }
        
    
    float n = brightness;
    gl_FragColor = vec4( n, n, n, 1.);
 
}
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
