#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 st = gl_FragCoord.xy /min(resolution.x,resolution.y);
    float l = 0.0;
    
    st *= 10.0;
    
    if((mod(st.y ,2.0) > 1.0) && sin(time) > 0.0){
    	st.x +=  (time*5.0);
	st.y +=  abs(sin(time*5.0));
    }else{
    	st.x -= (time*5.0);
	st.y -= abs(sin(time*5.0));
    }

    vec2 tilePos = fract(st); 
    
    //各タイルの座標(0.0,0.0)を中心に持ってくる
    tilePos = (tilePos*2.0 - 1.0);
    
    
            if(
                //偶数行と偶数列は四角を描く
                mod(st.x ,2.0) > 1.0 ||
                mod(st.y ,1.0) > 1.0
                ){
                vec2 c = max(abs(tilePos) - 0.6*abs(sin(time)),0.0);
                l = length(c);
                l = ceil(l);    
            }else{
                //奇数行と奇数列は丸を描く
                l = step(0.7*abs(sin(time)),length(tilePos));
            }

	 float r = abs(sin(time * 0.9));
    	float g = abs(cos(time * 2.0));
    	float b = (r + g) / 2.0;

	gl_FragColor = vec4(l, g, b,1.0);
}
