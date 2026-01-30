/*
 * Original shader from: https://www.shadertoy.com/view/WdKyzV
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
const float GRID = 4.;
const float PI = 3.14159265;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float circle(in vec2 _st, in vec2 _circle, in float _radius) {
    vec2 d = _circle - _st;
    return step(dot(d, d), _radius * _radius);
}

float poly(in vec2 _st, in vec2 _poly, in float _rad) {
    // polygon is 4 points on a circle
    // _poly is coordinates of origin of polygon
    vec4 _angles = vec4(random(_poly+vec2(.1)), random(_poly+vec2(.2)),
                    random(_poly+vec2(.3)), random(_poly+vec2(.4)) );
    float _total = _angles[0] + _angles[1] + _angles[2] + _angles[3];
    _angles *= 2. * PI / _total;
    
    _angles[1] += _angles[0];
    _angles[2] += _angles[1];
    _angles[3] += _angles[2];
    
    vec4 _a2 = vec4(0.);
    
    vec2 _p0 = vec2(_poly.x+_rad*cos(_angles[0]), _poly.y+_rad*sin(_angles[0]));
    vec2 _p1 = vec2(_poly.x+_rad*cos(_angles[1]), _poly.y+_rad*sin(_angles[1]));
    vec2 _p2 = vec2(_poly.x+_rad*cos(_angles[2]), _poly.y+_rad*sin(_angles[2]));
    vec2 _p3 = vec2(_poly.x+_rad*cos(_angles[3]), _poly.y+_rad*sin(_angles[3]));
    
    _a2[0] = atan(_p0.y-_st.y, _p0.x-_st.x); // cant assign these in a loop?
    _a2[1] = atan(_p1.y-_st.y, _p1.x-_st.x);
    _a2[2] = atan(_p2.y-_st.y, _p2.x-_st.x);
    _a2[3] = atan(_p3.y-_st.y, _p3.x-_st.x);
    
    vec4 _a3 = _a2.gbar;
    
    float _ret = 1.;
    
    for (int _i = 0; _i < 4; _i++) {
        float _aDiff = _a3[_i] - _a2[_i];
        
        _aDiff = mod(_aDiff + 2.*PI, 2.*PI);
        
        // if angle difference > 180 degrees then return 0
        _ret *= step(_aDiff,PI);
    }
    
    
    return _ret;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 st = fragCoord / 8.;
    
    float shade = 0.;
    
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    vec3 col = vec3(0.);
    
    for (float xx = -GRID; xx <= GRID; xx++) {
        for (float yy = -GRID; yy <= GRID; yy++) {
        
            vec2 i2 = i+vec2(xx,yy);
            
            float merge = random(i2+vec2(-1000.));
            vec3 _col = vec3(0.,merge,1.);
            
            float brightOff = random(i2+vec2(-2000.)) * 2. * PI;
            float brightness = (1.+sin(iTime + brightOff))*.5;
            brightness = brightness * brightness * brightness;
            _col = (1.-brightness)*_col + brightness * vec3(1.);
            
            float rad = .5+(GRID-.5)*random(i2);
            
            float _a = .5 * poly(st, i2+vec2(.5), rad);
            col = (1.-_a) * col + _a * _col;
        }
    }
    
    
    fragColor = vec4(col, 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}