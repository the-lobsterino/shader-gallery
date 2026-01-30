    #ifdef GL_ES
    precision highp float;
    #endif
    
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform float  segments_w;
    uniform float  segments_h;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float texture_id;

    void main()
    {
        vec2 mod_uv = vec2(vUv.x*segments_w , vUv.y*segments_h);
        vec4 textcolor1= texture2D(texture1, mod_uv);
        vec4 textcolor2= texture2D(texture2, mod_uv);
        if(texture_id < 0.5) {
            gl_FragColor = textcolor1;
        }
        else {
            gl_FragColor = textcolor2;
        }
        
    }