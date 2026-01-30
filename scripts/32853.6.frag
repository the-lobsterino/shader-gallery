#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
// BY COLE KISSANE (coler706@gmail.com)
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float PI=atan(0.0,-1.0);
float wa(float val){
	return floor(0.5+sin(val));
}
float hue2rgb(float f1, float f2, float hue) {
    if (hue < 0.0)
        hue += 1.0;
    else if (hue > 1.0)
        hue -= 1.0;
    float res;
    if ((6.0 * hue) < 1.0)
        res = f1 + (f2 - f1) * 6.0 * hue;
    else if ((2.0 * hue) < 1.0)
        res = f2;
    else if ((3.0 * hue) < 2.0)
        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else
        res = f1;
    return res;
}

vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb;
    
    if (hsl.y == 0.0) {
        rgb = vec3(hsl.z); // Luminance
    } else {
        float f2;
        
        if (hsl.z < 0.5)
            f2 = hsl.z * (1.0 + hsl.y);
        else
            f2 = hsl.z + hsl.y - hsl.y * hsl.z;
            
        float f1 = 2.0 * hsl.z - f2;
        
        rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
        rgb.g = hue2rgb(f1, f2, hsl.x);
        rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
    }   
    return rgb;
}

vec3 hsl2rgb(float h, float s, float l) {
    return hsl2rgb(vec3(h, s, l));
}
void main( void ) {
float t=time*2.0;
	vec2 position = ( gl_FragCoord.xy / resolution.yy )-vec2(0.5)*resolution.xx/resolution.yx;
	vec2 point=position*20.0;
	
	float color = 0.0;
	float limit=sin(t)*1.0+1.0;
	point.x=point.x/3.0*sqrt(3.0)-time;
	point.y=point.y-time;
	vec3 col=vec3(color);
	col=hsl2rgb(vec3(mod(time/20.0+0.5,1.0),1.0,0.1));
	if(cos(point.y)*cos(point.x)+cos(point.x)*cos(point.x)<limit){
		color=1.0;
		col=hsl2rgb(vec3(mod(time/20.0,1.0),1.0,0.7));
	}
	
	
	gl_FragColor = vec4( col, 1.0 );
}