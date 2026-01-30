/*
 * Original shader from: https://www.shadertoy.com/view/ws2XRR
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
////////////////////////////////////////////////////////////////////////////////
//
// Trying out a looping motion-path for a ball by sampling 2D simplex-noise.
//
// Copyright 2019 Mirco Müller
//
// Author(s):
//   Mirco "MacSlow" Müller <macslow@gmail.com>
//
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License version 3, as published
// by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranties of
// MERCHANTABILITY, SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR
// PURPOSE.  See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program.  If not, see <http://www.gnu.org/licenses/>.
//
////////////////////////////////////////////////////////////////////////////////

const float EPSILON = .001;
const int MAX_ITER = 48;
const float STEP_BIAS = 1.2;

mat2 r2d (in float degree) {
	float c = cos (radians (degree));
    float s = sin (radians (degree));
    return mat2 (vec2(c, s), vec2(-s, c));
}

// using a slightly adapted implementation of iq's simplex noise from
// https://www.shadertoy.com/view/Msf3WH with hash(), noise() and fbm()
vec2 hash (in vec2 p)
{
    p = vec2 (dot (p, vec2 (127.1, 311.7)),
              dot (p, vec2 (269.5, 183.3)));

    return -1. + 2.*fract (sin (p)*43758.5453123);
}

float noise (in vec2 p)
{
    const float K1 = .366025404;
    const float K2 = .211324865;

    vec2 i = floor (p + (p.x + p.y)*K1);
    
    vec2 a = p - i + (i.x + i.y)*K2;
    vec2 o = step (a.yx, a.xy);    
    vec2 b = a - o + K2; 
    vec2 c = a - 1. + 2.*K2;

    vec3 h = max (.5 - vec3 (dot (a, a), dot (b, b), dot (c, c) ), .0);

    vec3 n = h*h*h*h*vec3 (dot (a, hash (i + .0)),
                           dot (b, hash (i + o)),
                           dot (c, hash (i + 1.)));

    return dot (n, vec3 (70.));
}

float fbm (in vec2 p, in int iters)
{
    mat2 rot = r2d (27.5);
    float d = .0;
    float f = 1.;
    float fsum = .0;

    for (int i = 0; i < 4; ++i) {
        d += f*noise (p);
        p *= rot;
        fsum += f;
        f *= .5;
    }
    d /= fsum;

    return d;
}

float sdSphere (in vec3 p, in float r) {
    return length (p) - r;
}

float scene (in vec3 p) {
    vec3 pBottom = p;
	float phase = p.x*p.x + p.z*p.z;
    float bottom = pBottom.y + 1. + .25*(.5 + .5*cos (phase));

    vec3 pTop = p;
    float top = -(pTop.y - 3.);

    // this, apart from the simplex-noise, is the most interesting piece
    // of code imo... here a pseudo-random (but looping) motion-path for
    // the ball is created
	float t = iTime;
	vec3 ballCenter = p;
    int iters = 4;
    vec2 sampleAt = vec2 (cos (t), sin(t));
	ballCenter.x += fbm (1. + sampleAt, iters);
	ballCenter.y += .5*fbm (2. + sampleAt, iters);
	ballCenter.z += fbm (3. + sampleAt, iters);
	float ball = sdSphere (ballCenter, .3);

    return min (ball, min (bottom, top));
}

float raymarch (in vec3 ro, in vec3 rd) {
    float t = .0;
    float d = .0;
    for (int i = 0; i < MAX_ITER; ++i) {
        vec3 p = ro + d * rd;
        t = scene (p);
        if (abs (t) < EPSILON * (1. + .125*t)) break;
        d += t*STEP_BIAS;
    }

    return d;
}

vec3 normal (in vec3 p, in float epsilon) {
	float d = scene (p);
    vec2 e = vec2 (epsilon, .0);
    return normalize (vec3 (scene (p + e.xyy) - d,
                            scene (p + e.yxy) - d,
                            scene (p + e.yyx) - d));
}

float shadow (in vec3 p, in vec3 lPos)
{
	float distanceToLight = distance (p, lPos);
	vec3 n = normal (p, EPSILON);
	float distanceToObject = raymarch (p + .01*n,
									   normalize (lPos - p));
	bool isShadowed = distanceToObject < distanceToLight;
	return isShadowed ? .1 : 1.;
}

float falloff (in float dist) {
	return 8. / (dist*dist);
}

vec3 shadeBlinnPhong (in vec3 ro, in vec3 rd, in float d) {
	vec3 p = ro + d*rd;
    vec3 amb = vec3 (.1);
	vec3 diffC = vec3 (.95, .9, .5);
    vec3 specC = vec3 (1., .95, .9);
	vec3 diffC2 = vec3 (.5, .5, .95);
    vec3 specC2 = vec3 (.9, .9, 1.);

    vec3 n = normal (p, d*EPSILON);
    vec3 lPos = ro + vec3 (.5, 1.0, -3.);
    vec3 lPos2 = ro + vec3 (-1., 1.2, 2.);
    vec3 lDir = lPos - p;
    vec3 lDir2 = lPos2 - p;
    vec3 lnDir = normalize (lDir);
    vec3 lnDir2 = normalize (lDir2);
    float sha = shadow (p, lPos);
    float sha2 = shadow (p, lPos2);
	float lDist = distance (p, lPos);
	float lDist2 = distance (p, lPos2);

    float diff = max (dot (n, lnDir), .0);
    float diff2 = max (dot (n, lnDir2), .0);
	vec3 h = normalize (lDir - rd);
	vec3 h2 = normalize (lDir2 - rd);
    float spec = pow (max (dot (h, n), .0), 20.);
    float spec2 = pow (max (dot (h2, n), .0), 40.);

	float phase = cos (13.*p.x);
	float phase2 = cos (13.*p.z);
	float mask = smoothstep (.01, .001, (.5 + .5*phase));
	float mask2 = smoothstep (.01, .001, (.5 + .5*phase2));

    // coloring/texturing the floor and ball is on major hack ;)
	vec3 matC = mix (vec3 (1.), vec3 (.0), 1. - mask);
	vec3 matC2 = mix (vec3 (1.), vec3 (.0), 1. - mask2);
	matC = (p.y > -1.9 && p.y < -.5) ? matC : vec3 (1.);
	matC2 = (p.y > -1.9 && p.y < -.5) ? matC2 : vec3 (1.);
	vec3 color = matC + matC2;

    vec3 diffTerm = sha * falloff (lDist) * diff * diffC * color;
    vec3 diffTerm2 = sha2 * falloff (lDist2) * diff2 * diffC2 * color;
    vec3 specTerm = (sha > .1) ? falloff (lDist) * spec * specC : vec3 (.0);
    vec3 specTerm2 = (sha2 > .1) ? falloff (lDist2) * spec2 * specC2 : vec3 (.0);

	return amb + diffTerm + specTerm + diffTerm2 + specTerm2;
}

vec3 camera (in vec2 uv, in vec3 ro, in vec3 aim, in float zoom)
{
    vec3 camForward = normalize (vec3 (aim - ro));
    vec3 worldUp = vec3 (.0, 1., .0);
    vec3 camRight = normalize (cross (worldUp, camForward));
    vec3 camUp = normalize (cross (camForward, camRight));
    vec3 camCenter = ro + camForward * zoom;
	    
    return normalize (camCenter + uv.x*camRight + uv.y*camUp - ro);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // normalize and aspect-correct UVs
	vec2 uv = fragCoord.xy/iResolution.xy;
	vec2 uvRaw = uv;
    uv = uv*2. - 1.;
    uv.x *= iResolution.x/iResolution.y;

    // setup camera motion, position and view-ray
    float angle = radians (300. + 55.*iTime);
    float dist = 3. + cos (.125*iTime);
    vec3 ro = vec3 (dist*cos (angle), 1., dist*sin (angle));
    vec3 aim = vec3 (.0);
    float zoom = 2.;
    vec3 rd = camera (uv, ro, aim, zoom);

    // sphere-trace/ray-march the thing
    float d = raymarch (ro, rd);
	float fog = 1. / (1. + d*d*.125);
    vec3 p = ro + d * rd;

    // shade the result
    vec3 col = shadeBlinnPhong (ro, rd, d);

    // fog, tone-mapping, gamme-correction, vignette
	col *= fog;
    col = col / (1. + col);
    col = .1 * col + .9*sqrt (col);
	col *= .8 + .2 * pow (16.*uvRaw.x*uvRaw.y*(1. - uvRaw.x)*(1. - uvRaw.y), .3);

	fragColor = vec4 (col, 1.);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}