/*
 * Original shader from: https://www.shadertoy.com/view/ll3GWn
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
const vec4 iMouse = vec4(0.);

// Emulate a black texture
#define texture(s, uv) vec4(0.0)
#define textureLod(s, uv, lod) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //

#define DITHER

#define PI 3.14159265359
#define SCALE 2.5
#define MARCH_DIST 0.5
#define MARCH_STEPS 30
#define sunColor vec3(1.0, 0.9, 0.65)*2.0
#define nozColor vec3(1.0, 0.3, 0.0)*4.0

float fracSequence = 0.0;
float fracFall = 0.0;
float fracTotal = 0.0;
float fracScale = 0.0;
vec3 nozzlePosition = vec3(0);
float nozzleStrength = 0.0;
float altSpaceFrac = 0.0;
mat2 altRot = mat2(0);
mat2 altHeading = mat2(0);
float altAccel = 0.0;
vec3 sunDir = vec3(0);
float sunStrength = 0.0;
vec3 backgroundColor = vec3(0);

mat2 rot( in float a ) {
    float c = cos(a);
    float s = sin(a);
	return mat2(c,s,-s,c);	
}

// 1D noise
float hash( in float n ) { return fract(sin(n)*753.5453123); }

// iq's 3D noise
float noise( in vec3 x ) {
    vec3 f = fract(x);
    vec3 p = x - f;
    f = f*f*(3.0 - 2.0*f);
    vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;
    vec2 rg = textureLod(iChannel0, (uv + 0.5)/256.0, 0.0).rg;
    return mix(rg.y, rg.x, f.z);
}

// iq's fog
vec3 fog( in vec3 rgb, in float dist, in vec3 rayOri, in vec3 rayDir ) {
    float c = 0.01;
    float b = 0.3;
    rayOri -= 8.0;
    rayOri += altSpaceFrac*9.0;
    float fogAmount = c * exp(-rayOri.z*b) * (1.0-exp( -dist*rayDir.z*b ))/rayDir.z;
    fogAmount = clamp(fogAmount, 0.0, 1.0);
    vec3 fogColor = backgroundColor;
    return mix( rgb, fogColor, fogAmount );
}

// fairing shape, [0, 1] -> [0, 1]
float fairingFunc( in float x ) {
    #define MI 0.4
    if (x < MI) {
        float v = 0.75 + x*1.5;
        return clamp(v, 0.85, 1.0);
    } else {
        float xx = (x - MI) / (1.0 - MI);
        xx *= xx;
        return max(0.0, 1.0 - xx);
    }
}

// rocket distance estimator, returns the distance to the rocket without fairings
void rocketDE( in vec3 p, out float d, out int id, out vec3 texCoord ) {
    float lenxy = length(p.xy);
    vec2 ori = p.xy / lenxy;
    
    // main fuel tank
    float tank = lenxy - 0.3;
    tank = max( tank, abs(p.z - 0.3) - 0.7 );
    
    // spherical combustion chamber
    float engine = length(p + vec3(0.0, 0.0, +0.35)) - 0.27;
    // add tubes
    vec2 tubeOffset = p.xy - sign(p.xy) * 0.07;
    float tube = length(tubeOffset) - 0.05;
    tube = max( tube, abs(p.z + 0.6) - 0.1 );
    engine = min(engine, tube);
    // engine nozzle
    float nozzle = dot( vec2(0.9701, 0.2425), vec2(lenxy, p.z) );
    nozzle += sin(p.z*114.0)*0.007; // add some ridges
    nozzle = max(nozzle, abs(p.z + 0.85) - 0.15);
    nozzle = max(nozzle, -(length(p + vec3(0.0, 0.0, 1.1)) - 0.26));
    engine = min(engine, nozzle);
    
    texCoord = p;
    if (tank < engine) {
        d = tank;
        id = 1;
    } else {
        d = engine;
        id = 2;
    }
}

// falling rocket + falling fairings distance estimator
void rocketAndFairingDE( in vec3 p, in float frac, in float seed,
                         out float d, out int id, out vec3 texCoord ) {
    float gravity = frac*frac;
    vec3 tp = p;
    
    // randomize rotation of each rockets
    tp.xy *= rot( PI*sin(seed*4125.664) );
    
    vec3 rp = tp;
    if (frac > 0.0) {
        rp.z += gravity*88.0;
        float randRot = 1.1 * sin(seed*321.81);
        rp.xz *= rot(frac*2.0*randRot);
    }
        
    // get the distance to the rocket
    rocketDE(rp, d, id, texCoord);
    
    // for each parts of the fairings
    for (int i = -1; i <= 1; i += 2) {
        float ii = float(i);
        float ss = sign(ii);
        
        vec3 origin = vec3(0.0, 0.0, 1.0);
        // add horizontal velocity
        origin.y += ii*frac*18.0;
        // then gravity
        origin.z -= gravity*72.0;
        
        vec3 pp = tp - origin;
        if (frac > 0.0) {
            // randomize rotation of each fairing parts
            float randRot = 1.0 + sin(seed*391.81+ii*122.35+154.42)*0.2;
            float randRot2 = sin(seed*458.91+ii*138.42+284.66);
            vec3 delt = vec3(0.0, ss*0.1, -0.5);
            pp += delt; // change center of gravity
            pp.yz *= rot(frac*-ss*14.0*randRot);
            pp.xy *= rot(frac*randRot2*4.0);
            pp -= delt;
        }
        
        float fairDist = length(pp.xy) - fairingFunc(pp.z/1.5)*0.32;
        fairDist = abs(fairDist)-0.01;
        fairDist = max(fairDist, -pp.z);
        fairDist = max(fairDist, pp.z-1.5);
        fairDist = max(fairDist, -pp.y*ss);
        
        if (fairDist < d) {
            d = fairDist;
            id = 3;
            texCoord = pp;
        }
    }
}

// rocket inside a rocket
void fractalRocketDE( in vec3 p, out float d, out int id, out vec3 texCoord ) {
    p.yz *= altRot;
    
    vec3 bottomP = p/fracScale;
    bottomP.z += fracTotal * 1.45;
    float bottomSeed = fracSequence;
    float bottomDist = 0.0;
    int bottomID = 0;
    vec3 bottomTexCoord = vec3(0);
    rocketAndFairingDE(bottomP, fracFall, bottomSeed, bottomDist, bottomID, bottomTexCoord);
    bottomID = -bottomID; // invert the sign of the bottom rocket
    bottomDist *= fracScale;
    
    float topScale = fracScale / SCALE;
    vec3 topP = p;
    topP.z -= (1.0 - fracTotal) * 1.45;
    topP /= topScale;
    float topSeed = fracSequence + 1.0;
    float topDist = 0.0;
    int topID = 0;
    vec3 topTexCoord = vec3(0);
    rocketAndFairingDE(topP, 0.0, topSeed, topDist, topID, topTexCoord);
    topDist *= topScale;
    
    if (bottomDist < topDist) {
        d = bottomDist;
        id = bottomID;
        texCoord = bottomTexCoord;
    } else {
        d = topDist;
        id = topID;
        texCoord = topTexCoord;
    }
}

// normal function
vec3 normal(vec3 p, int id, vec3 texCoord) {
    float dist = 0.0;
    vec3 distV = vec3(0);
    
    int tempID = 0;
    vec3 tempTexCoord = vec3(0);
	vec3 e = vec3(0.001, 0.0, 0.0);
    fractalRocketDE(p, dist, tempID, tempTexCoord);
    fractalRocketDE(p-e.xyy, distV.x, tempID, tempTexCoord);
    fractalRocketDE(p-e.yxy, distV.y, tempID, tempTexCoord);
    fractalRocketDE(p-e.yyx, distV.z, tempID, tempTexCoord);
    vec3 n = dist-distV;
    
    // do normal mapping on the surface of the tank
    if (id == 1 || id == -1) {
        n.x += noise(texCoord*80.12)*0.0002 - 0.0001;
        n.y += noise(texCoord*79.14)*0.0002 - 0.0001;
        n.z += noise(texCoord*81.19)*0.0002 - 0.0001;
    }
    
	return normalize(n);
}

// light the scene
vec3 light( in vec3 p, in vec3 n, in vec3 c, in vec3 dir, in float rough, in bool doNoz ) {
    vec3 pp = p;
    p.yz *= altRot;
    float specScale = (rough+1.0)*0.25;
    
    float sun = max(0.0, -dot(n, sunDir));
    float sunSpec = pow(max(0.0, -dot(dir, reflect(sunDir, n))), rough);
    sun += sunSpec*specScale;
    sun *= sunStrength;
    
    float noz = 0.0;
    if (doNoz) {
        vec3 delt = (nozzlePosition - p) / fracScale;
        vec3 deltN = normalize(delt);
        vec3 nn = n;
        nn.yz *= altRot;
        noz = max(0.0, dot(nn, deltN));
        float nozSpe = pow(max(0.0, dot(dir, reflect(deltN, nn))), rough);
        noz += nozSpe*specScale;
        noz /= dot(delt, delt);
        noz *= nozzleStrength;
    }
    
    float ao = 0.0;
    int id = 0;
    vec3 texCoord = vec3(0.0);
    fractalRocketDE(pp+n*0.1, ao, id, texCoord);;
    ao = clamp(ao / 0.1, 0.0, 1.0);
    
    vec3 result = c*ao*backgroundColor*0.2;
    result += c*sun*sunColor;
    result += c*noz*nozColor;
    return result;
}

// density function for the trail
vec4 density( in vec3 p ) {
    p.yz *= altRot;
    
    // accelerate the smoke along the rocket trajectory
    vec3 accel = vec3(0.0, 0.0, iTime*16.0);
    float grav = (fracTotal*fracTotal)*-32.0;
    
    vec3 pp = (p-nozzlePosition) / fracScale;
    vec3 ppp = pp;
    pp.x += noise(p*1.2+accel)*0.2-0.1;
    pp.y += noise(p*1.3+accel)*0.2-0.1;
    pp.z += noise(p*1.6+accel)*0.2-0.1;
    
    vec2 cyl = vec2(length(pp.xy), pp.z);
    
    // add smoke around the trail
    float nozzle = dot( vec2(0.9801, 0.1725), cyl );
    float alphaNozzle = 1.0 - smoothstep(0.0, 0.1, nozzle);
    alphaNozzle *= 1.0 - smoothstep(0.0, 0.05, pp.z);
    alphaNozzle *= smoothstep(grav, grav+1.0, pp.z);;
    alphaNozzle /= fracScale;
    alphaNozzle *= nozzleStrength;
    alphaNozzle = clamp(alphaNozzle, 0.0, 1.0);
    
    // add some noise
    float noiseValue = 1.0;
    noiseValue += noise(p*1.9+accel)*3.0;
    noiseValue += noise(p*2.2+accel)*1.0;
    noiseValue += noise(p*4.4+accel)*0.5;
    noiseValue *= (1.0-altSpaceFrac);
    noiseValue *= 0.005;
    noiseValue = clamp(noiseValue, 0.0, 1.0);
    
    // add a fire trail
    ppp.z += 0.05;
    float len = length(ppp);
    float theta = acos(-ppp.z / len) / (PI*0.5);
    float randV = noise(p*4.0+accel);
    float radius = 1.0 / (theta + 0.01 + randV*0.05);
    float fire = 1.0 - smoothstep(0.0, 0.1, len - radius * 0.04);
    fire /= fracScale;
    fire *= 2.0;
    fire *= nozzleStrength;
    fire *= smoothstep(grav-2.0, grav-1.0, pp.z);
    fire = clamp(fire, 0.0, 1.0);
    
    // base color of the smoke
    vec3 baseColor = mix(vec3(0.5), vec3(0.8), noise(p*2.0+accel));
    baseColor *= 1.0 - alphaNozzle*0.9; // lighter outside the trail
    baseColor *= (sunStrength*0.75+0.25); // darker during night
    baseColor = mix(baseColor, nozColor, fire); // colored fire
    
    return vec4(baseColor, max(noiseValue, max(alphaNozzle, fire)));
}

// background color
vec3 getBackground( in vec3 dir ) {
    // rotate stars
    vec3 ddir = dir;
    ddir.yz *= altHeading;
    
    // add stars
    float noiseValue = 1.0;
    noiseValue *= noise( ddir*161.58 );
    noiseValue *= noise( ddir*323.94 );
    float stars = noiseValue*1.08;
    stars *= stars; stars *= stars;
    stars *= stars; stars *= stars;
    vec3 starry = mix(vec3(0), vec3(1), stars);
    // sun
    float dsun = max(0.0, -dot(sunDir, dir));
    float sun = smoothstep(0.9996, 0.999956, dsun);
    starry = mix(starry, sunColor, sun);
    float factor = pow(dsun, 2000.0);
    starry += sunColor*sunStrength*0.4*factor;
    return starry;
}

// ground color
vec3 getGroundColor( in vec3 dir ) {
    vec3 texCoord = dir/(dir.z/(1.0+altSpaceFrac*5.0));
    texCoord *= 0.01;
    texCoord.y += altAccel*altSpaceFrac*0.18;
    texCoord.xy *= rot(5.0832);
    float backColor = smoothstep(-1.0+altSpaceFrac*0.75, 0.0, dir.z)*0.4+0.6;
    vec3 groundColor = texture(iChannel2, texCoord.xy).rgb;
    groundColor = mix(groundColor, backgroundColor, (1.0-sunStrength)*0.7);
    return mix(groundColor, backgroundColor, backColor);
}

// texture for the fairings
vec3 getFairingColor( in vec3 texCoord ) {
    if (texCoord.z < 0.1) return vec3(0.95, 0.4, 0.0);
    vec2 grid = vec2(texCoord.z, atan(texCoord.y, texCoord.x) / PI * 0.5 + 0.5);
    grid *= vec2(2.5, 6.0);
    grid = floor(grid);
    float gridValue = mod(grid.x+grid.y, 2.0);
    if (grid.x > 1.5) gridValue = 1.0;
    if (abs(texCoord.y) < 0.01) gridValue = 0.0;
    return mix(vec3(0.4, 0.4, 0.45), vec3(0.6, 0.6, 0.65), gridValue);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    // initialize global variables once
    float timeValue = (iTime-10.0) * 0.05;
    fracSequence = floor(timeValue);
	fracFall = fract(timeValue);
	fracTotal = smoothstep(0.0, 0.5, fracFall);
    fracScale = mix(1.0, SCALE, fracTotal);
    nozzlePosition = vec3(0.0, 0.0, 1.1 - fracTotal*2.1);
    nozzleStrength = smoothstep(0.0, 0.02, fracTotal);
    nozzleStrength *= 1.0 - smoothstep(0.8, 1.0, fracFall);
    altSpaceFrac = 1.0 - pow(4.2, -iTime*0.01);
    altRot = rot(PI*0.5*altSpaceFrac);
    altAccel = iTime*0.07;
    altAccel *= altAccel;
	altHeading = rot(-altAccel*0.09*altSpaceFrac);
    sunDir = normalize(vec3(-1.4, 3.7, 1.1));
    sunDir.yz *= altHeading;
    sunDir.z *= -1.0;
    sunStrength = 1.0 - smoothstep(-0.15, 0.08, sunDir.z);
    backgroundColor = mix(vec3(0.2, 0.3, 0.4), vec3(0.5, 0.6, 0.7), sunStrength);
    
    vec2 uv = fragCoord.xy / iResolution.xy * 2.0 - 1.0;
	uv.y *= iResolution.y / iResolution.x;
	
	vec3 from = vec3(-14.0 + smoothstep(0.0, 20.0, iTime)*4.0, 0.0, 0);
	vec3 dir = vec3(uv.x*0.5, 1.0, uv.y*0.5);
    dir.y += exp(length(uv)) * 0.15;
    dir = normalize(dir);
	dir.xy *= rot(3.1415*.5);
    
    vec2 mouse=(iMouse.xy / iResolution.xy - 0.5) * 0.5;
	if (iMouse.z < 1.0) mouse = vec2(0.0);
    
    float shake = smoothstep(0.1, 0.3, fracTotal);
    shake *= 1.0 - smoothstep(0.7, 0.9, fracFall);
    vec2 rand = vec2(noise(vec3(iTime*15.4, 0.0, 0.0)),
                     noise(vec3(iTime*17.2, 9.9, 9.9))) * shake;
    
    mat2 rotxz = rot(-0.16-mouse.y*5.0 + sin(iTime*0.0645)*0.07 + rand.x*0.01);
	mat2 rotxy = rot(0.2+mouse.x*8.0 + sin(iTime*0.0729)*1.1 + rand.y*0.01);
	
    from.xz *= rotxz;
	from.xy *= rotxy;
	dir.xz  *= rotxz;
	dir.xy  *= rotxy;

	float totdist = 0.0;
	bool set = false;
	vec3 norm = vec3(0);
    float dist = 0.0;
    int id = 0;
    vec3 texCoord = vec3(0);
    
    // offset starting distance with a dithered value
    vec2 randVec = vec2(hash(iTime), hash(iTime*1.61541));
    float dither = texture(iChannel1, fragCoord.xy / 8.0 + randVec).r;
    fractalRocketDE(from, dist, id, texCoord);
    #ifdef DITHER
    totdist += dist*dither;
    #endif
    // run sphere tracing to find the rocket surface
	for (int steps = 0 ; steps < 50 ; steps++) {
		if (set) continue;
		vec3 p = from + totdist * dir;
        fractalRocketDE(p, dist, id, texCoord);
        dist *= 0.75;
		totdist += max(0.0, dist);
		if (dist < 0.01) {
			set = true;
			norm = normal(p, id, texCoord);
		}
	}
    
    // do surface texture/light when an object is found
    if (set) {
        vec3 emiss = vec3(0);
        vec3 color = vec3(0);
        float rough = 0.0;
        
        bool bot = id < 0;
        int iid = bot ? -id : id;
        if (iid == 1) {
            color = vec3(0.5, 0.3, 0.1);
            rough = 8.0;
        } else if (iid == 2) {
            color = vec3(0.05);
            float nozz = smoothstep(0.6, 1.3, -texCoord.z);
            if (id > 0) nozz *= smoothstep(0.0, 0.7, fracTotal);
            emiss = vec3(nozColor) * nozz * 0.4;
            rough = 16.0;
        } else if (iid == 3) {
            color = getFairingColor(texCoord);
            rough = 3.0;
        }
        
        fragColor.a = 1.0;
        fragColor.rgb = light( from+dir*totdist, norm, color, dir, rough, bot );
        fragColor.rgb += emiss;
    } else {
        // pass some landscape on the ground
    	backgroundColor = getGroundColor(dir);
        // get the background otherwise
        fragColor.rgb = getBackground(dir);
        totdist = 99999.9;
    }
    
    // modify the background color when looking at the sun
    float sunLook = max(0.0, dot(dir, -sunDir))*sunStrength;
    sunLook *= sunLook; sunLook *= sunLook;
    backgroundColor = mix(backgroundColor, sunColor, sunLook);
    
    // apply fog
    fragColor.rgb = fog( fragColor.rgb, totdist, from, dir);
    
    // do volumetric rendering back to front
    float totdistmarch = MARCH_DIST*float(MARCH_STEPS);
    totdistmarch = min(totdist, totdistmarch);
    #ifdef DITHER
    totdistmarch -= dither*MARCH_DIST;
    #endif
    for (int steps = 0 ; steps < MARCH_STEPS ; steps++) {
        if (totdistmarch < 0.0) continue;
        
        vec3 p = from + totdistmarch * dir;
        vec4 col = density(p);
        col.a *= MARCH_DIST;
        
       	// apply fog to the color
        col.rgb = fog( col.rgb, totdistmarch, from, dir );
        // accumulate opacity
        fragColor.rgb = fragColor.rgb*(1.0-col.a)+col.rgb*col.a;
        
        totdistmarch -= MARCH_DIST;
	}
    
    fragColor.rgb = pow( fragColor.rgb, vec3(1.0/2.2) );
    fragColor.a = 1.0;
    
    // vignette
    fragColor.rgb -= dot(uv, uv)*0.1;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}