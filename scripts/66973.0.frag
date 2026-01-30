#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

 uniform float time;
      uniform sampler2D image;
      uniform float u_height;
        uniform float u_maxHeight;
        uniform float u_offsetOpcity;
        uniform float u_minOpcity;

        varying vec3 vp;
        varying vec2 vUv;

void main( void ) {

	   if (vp.y > u_height) {
            gl_FragColor = texture2D(image, vec2(0.5, 0.99));
            gl_FragColor.a = u_minOpcity;
          } else {
            float interpolation = (u_maxHeight - (u_height - vp.y)) / u_maxHeight;
            gl_FragColor = texture2D(image, vec2(0.5, interpolation));
            gl_FragColor.a += u_offsetOpcity;
            gl_FragColor.a = max(u_minOpcity, gl_FragColor.a);

}
}