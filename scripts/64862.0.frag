/*
 * Original shader from: https://www.shadertoy.com/view/WtK3zR
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
// https://soundcloud.com/omfgnation/omfg-get-out-free-download
// Definitely not cleaned up/optimized. Just playing around making shaders ^^

// Computed from a screenshot, scaled to match the uvs.
#define char_r .188
#define char_d .376
#define stroke_width .04
#define circle_r .12
#define ORANGE vec3(255,171,83)/255.
#define BLUE vec3(135,213,234)/255.
#define BAR_SMALL .332
#define BAR_LARGE .664

float sdHorseshoe( in vec2 p, in float t, in float r, in vec2 w )
{
    vec2 c = vec2(cos(t),sin(t));
    p.x = abs(p.x);
    float l = length(p);
    p = mat2(-c.x, c.y, 
              c.y, c.x)*p;
    p = vec2((p.y>0.0)?p.x:l*sign(-c.x),
             (p.x>0.0)?p.y:l );
    p = vec2(p.x,abs(p.y-r))-w;
    return length(max(p,0.0)) + min(0.0,max(p.x,p.y));
}

vec2 rot(in vec2 p, in float angle) {
	float c = cos(angle);
	float s = sin(angle);
    return mat2(c,s,-s,c)*p;
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

float ring(in vec2 uv) {
    return abs(length(uv)-circle_r)-stroke_width;
}
float ring_cut(in vec2 uv) {
    // Rotated/translated to cut out the right side of the ring.
    vec2 uv2 = vec2(uv.x+uv.y, uv.x-uv.y)/1.414 - 1.;
    return max(ring(uv), -sdBox(uv2, vec2(1)));
}


float get_G(in vec2 uv) {
    uv += vec2(char_d, -char_r);
    float w = (circle_r + stroke_width)/2.;
    return min(min(
        sdBox(uv-vec2(w,+stroke_width/2.), vec2(w,stroke_width/2.)),
        sdBox(uv-vec2(w/1.5,0), vec2(w/1.5,stroke_width))),
        sdHorseshoe(rot(uv, 0.3926991*3.), 0.3926991, circle_r, vec2(0, stroke_width)));
}
float get_E(in vec2 uv) {
    uv += vec2(0, -char_r);
    float w = (circle_r + stroke_width)/2.-.01;
    return min(
        sdBox(uv-vec2(-w,0), vec2(w,stroke_width)),
        sdHorseshoe(rot(uv, 0.3926991*4.), 0.3926991*2., circle_r, vec2(0, stroke_width)));
}
float get_T(in vec2 uv) {
    uv += vec2(-char_d, -char_r);
    float w = (circle_r + stroke_width);
    return min(sdBox(uv, vec2(w,stroke_width)),sdBox(uv, vec2(stroke_width,w)));
}
float out_O(in vec2 uv) {
    return ring(uv + vec2(char_d, char_r));
}
float out_U(in vec2 uv) {
    uv += vec2(0, char_r);
    return sdHorseshoe(rot(uv, 0.3926991*0.), 0.3926991*2., circle_r, vec2(0, stroke_width));
}
float out_T(in vec2 uv) {
    uv += vec2(-char_d, char_r);
    float w = (circle_r + stroke_width);
    return min(sdBox(uv, vec2(w,stroke_width)),sdBox(uv, vec2(stroke_width,w)));
}



float percent;
bool range(float start, float stop) {
    float r = stop-start;
    percent = (iTime-start)/(stop-start);
    return 0. <=percent && percent <= 1.;
}

vec3 color = vec3(1);
void addColor(float d, vec3 c) {
    color = mix(c,color, smoothstep(0., .005, d));
}

void getOut(vec2 uv) {
    addColor(get_G(uv), ORANGE);
    addColor(get_E(uv), ORANGE);
    addColor(get_T(uv), ORANGE);
    addColor(out_O(uv), BLUE);
    addColor(out_U(uv), BLUE);
    addColor(out_T(uv), BLUE);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-iResolution.xy*.5)/iResolution.y*2.;
	
    
    color = vec3(1);
    
    //    getOut(uv);
    
    if(range(0., 1.)) {
        color = BLUE;
        addColor(uv.y-BAR_LARGE, ORANGE);
    }
    if(range(1., 1.5)) {
        color = BLUE;
    	addColor(uv.y-BAR_LARGE*mix(1.,0.,percent), ORANGE);
    }
    if(range(1.5, 3.)) {
        color = BLUE;
    	addColor(uv.y, ORANGE);
        percent = smoothstep(0.,1.,percent) * 1.2;
    	addColor(sdBox(uv-vec2(0,1), vec2(char_r*3.,clamp(0.,1.,percent))), ORANGE);
    	addColor(sdBox(uv-vec2(0,-1), vec2(char_r*3.,clamp(0.,1.,percent-.2))), BLUE);        
    }
    if(range(3., 3.5)) {
        color = BLUE;
    	addColor(abs(uv.x)-char_r*3., vec3(1));
    	addColor(uv.y, ORANGE);
        getOut(uv);
    	addColor(sdBox(uv-vec2(0,1), vec2(char_r*3.,mix(1., BAR_LARGE, percent))), ORANGE);
    	addColor(sdBox(uv-vec2(0,-1), vec2(char_r*3.,1.)), BLUE);
    }
    if(range(3.5, 4.)) {
        color = BLUE;
    	addColor(uv.y, ORANGE);
    	addColor(abs(uv.x)-char_r*3., vec3(1));
        getOut(uv);
    	addColor(sdBox(uv-vec2(0,1), vec2(char_r*3.,BAR_LARGE)), ORANGE);
    	addColor(sdBox(uv-vec2(0,-1), vec2(char_r*3.,mix(1., BAR_LARGE, percent))), BLUE);
    }
    if(range(4., 4.5)) {
        color = BLUE;
    	addColor(uv.y-mix(0., BAR_LARGE, percent), ORANGE);
    	addColor(abs(uv.x)-char_r*3., vec3(1));
        getOut(uv);
    	addColor(sdBox(uv-vec2(0,1), vec2(char_r*3.,BAR_LARGE)), ORANGE);
    	addColor(sdBox(uv-vec2(0,-1), vec2(char_r*3.,BAR_LARGE)), BLUE);
    }
    if(iTime>4.5) {
    	getOut(uv);
    	vec2 ring_uv = uv;
        ring_uv.x = abs(uv.x);
        ring_uv.x -= char_r*3.;
        if(ring_uv.x >0.){
            float dir = mod(floor(ring_uv.x/char_d),2.)*2.-1.;
            ring_uv.y = mod(ring_uv.y-iTime*.25*dir, char_d*2.);
            ring_uv.x = mod(ring_uv.x, char_d);
            addColor(ring(ring_uv-vec2(char_r,3.*char_r)), ORANGE);
            addColor(ring(ring_uv-vec2(char_r,char_r)), BLUE);
        }

        addColor(sdBox(uv-vec2(0,1), vec2(3,BAR_SMALL)), BLUE);
        addColor(sdBox(uv-vec2(0,1), vec2(char_r*3.,BAR_LARGE)), ORANGE);

        addColor(sdBox(uv-vec2(0,-1), vec2(3,BAR_SMALL)), ORANGE);
        addColor(sdBox(uv-vec2(0,-1), vec2(char_r*3.,BAR_LARGE)), BLUE);
    }
    
    //percent = 0.;
    if(range(4.5, 5.)) {
    	addColor(
            max(uv.y+mix(-BAR_LARGE,1.-BAR_SMALL,percent), char_r*3.-abs(uv.x)), ORANGE);
    }
    fragColor = vec4(color,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}