#ifdef GL_ES
    precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec4 old_main(vec2 position){
	
	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	return vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	
}




uniform sampler2D bgl_RenderedTexture;
uniform float bgl_RenderedTextureWidth;
uniform float bgl_RenderedTextureHeight;

const vec4 kappa = vec4(1.0,1.7,0.7,15.0);

float screen_width = resolution.x;
float screen_height = resolution.y;

const float scaleFactor = 0.8;

const vec2 leftCenter = vec2(0.25, 0.5);
const vec2 rightCenter = vec2(0.75, 0.5);

const float separation = 0.01;

// Scales input texture coordinates for distortion.
vec2 hmdWarp(vec2 LensCenter, vec2 texCoord, vec2 Scale, vec2 ScaleIn) {
    vec2 theta = (texCoord - LensCenter) * ScaleIn;
    float rSq = theta.x * theta.x + theta.y * theta.y;
    vec2 rvector = theta * (kappa.x +
                            kappa.y * rSq +
                            kappa.z * rSq * rSq +
                            kappa.w * rSq * rSq * rSq);
    vec2 tc = LensCenter + Scale * rvector;
    return tc;
}

bool validate(vec2 tc, int left_eye) {
    //keep within bounds of texture
    if ((left_eye == 1 && (tc.x < 0.0 || tc.x > 0.5)) ||
        (left_eye == 0 && (tc.x < 0.5 || tc.x > 1.0)) ||
        tc.y < 0.0 || tc.y > 1.0) {
        return false;
    }
    return true;
}

void main() {
    vec2 screen = vec2(screen_width, screen_height);

    float as = float(screen.x / 2.0) / float(screen.y);
    vec2 Scale = vec2(0.5, as);
    vec2 ScaleIn = vec2(2.0 * scaleFactor, 1.0 / as * scaleFactor);

    vec2 texCoord = (surfacePosition+vec2(.1))*5.;//gl_TexCoord[0].st;
    vec2 texCoordSeparated = texCoord;

    vec2 tc = vec2(0);
    vec4 color = vec4(0);

    // ad hoc enhanced separation to allow proper viewing factor 
    float ad_hoc_enhance_stereo = 4.0;

    if (texCoord.x < 0.5) {
        texCoordSeparated.x -= ad_hoc_enhance_stereo *separation;
        tc = hmdWarp(leftCenter, texCoordSeparated, Scale, ScaleIn );
        color = old_main(tc/resolution);
       // if (!validate(tc, 1))
           // color = vec4(1);
    } else {
        texCoordSeparated.x += ad_hoc_enhance_stereo *separation;
        tc = hmdWarp(rightCenter, texCoordSeparated, Scale, ScaleIn);
        color = old_main(tc/resolution);
        //if (!validate(tc, 0))
           // color = vec4(1);
    }
    gl_FragColor = mix(texture2D(bgl_RenderedTexture, (gl_FragCoord.xy+vec2(0,1))/resolution), color, 0.02);
}


// no clue what op's goal was