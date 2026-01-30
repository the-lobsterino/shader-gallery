
//-------------------------------------------------------- 
// Shader:   Procedural_Night_Reflections.glsl 
// Original: https://www.openprocessing.org/sketch/501793
// Author:   Pierre MARZIN 01/2017
// Info:     It's not what it says... 
//           Only a procedural noise warping based texture
// Input:    Move your mouse around...
//           Click to cycle through the number of octaves
//-------------------------------------------------------- 

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

int nOctaves = 3;

float random (in vec2 _st) 
{
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

float noise( in vec2 x )
{
    return sin(1.5*x.x)*sin(1.5*x.y);
}

const mat2 rotate = mat2(0.80, 0.60, -0.60, 0.80);

float fbm ( in vec2 _st) // Fractional Brownian Motion
{
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    for (int i = 0; i < 10; ++i) 
    {
	if(i>=nOctaves) break;
        v += a * noise(_st);
        _st = 2.0 * _st * rotate + shift;
        a *= 0.5;
    }
    return v;
}

void main() 
{
    vec2 st = 15.0*mouse.y*(gl_FragCoord.xy/resolution.y-.5);
    vec3 color = vec3(0.0);
    vec2 q = vec2(0.);
    nOctaves = 1+int((mouse.x * 6.));
    q.x = fbm( st + cos(0.02*time));
    q.y = fbm( st + sin(1.0-0.15*time));
    vec2 r = vec2(0.);
    r.x = fbm( st + (2.0*mouse.x+0.4)*q + vec2(1.7,2.2)+sin(st.x+0.035*time) );
    r.y = fbm( st + (2.0*mouse.y+.5)*q + vec2(8.3,2.8)+ sin(st.y+.2*time));
    float f = fbm(1.4*st+6.0*r);
    color = smoothstep(vec3(0.101961,0.19608,0.666667),vec3(0.666667,0.666667,0.98039),color);
    color = mix(color,vec3(1.856,.5*(1.0+sin(1.5+.2*time)),0.164706),r.x+length(q));
    color = mix(color,vec3(.5*(1.0-cos(.1*time)),.2+.2*(1.0+sin(0.5+.3*time)),1.0),length(r+q));
		color*=(1.5*f*f*f+1.8*f*f+1.7*f);
		color*=vec3(2.8+r,1.7+q.y);
		color=pow(color, vec3(.6));
    gl_FragColor = vec4(color,1.);
}