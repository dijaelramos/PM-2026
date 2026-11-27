"""Simulação segura. Para publicar, use iniciar_robo.bat."""
import sys
import robo

if __name__ == "__main__":
    sys.argv[1:] = ["--simular"] + sys.argv[1:]
    sys.exit(robo.main())
