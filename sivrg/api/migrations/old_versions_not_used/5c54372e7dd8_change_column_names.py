"""Change column names

Revision ID: 5c54372e7dd8
Revises: d35b90e30283
Create Date: 2024-02-17 18:12:09.304773

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5c54372e7dd8'
down_revision: Union[str, None] = 'd35b90e30283'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('choferes', sa.Column('id', sa.Integer(), autoincrement=True, nullable=False))
    op.drop_constraint('choferes_empresa_id_fkey', 'choferes', type_='foreignkey')
    op.create_foreign_key(None, 'choferes', 'empresas', ['empresa_id'], ['id'])
    op.drop_column('choferes', 'chofer_id')
    op.add_column('empresas', sa.Column('id', sa.Integer(), autoincrement=True, nullable=False))
    op.add_column('empresas', sa.Column('nombre', sa.String(length=255), nullable=False))
    op.add_column('empresas', sa.Column('RS', sa.String(length=255), nullable=False))
    op.add_column('empresas', sa.Column('CUIT', sa.String(length=255), nullable=False))
    op.add_column('empresas', sa.Column('direccion', sa.String(length=255), nullable=False))
    op.add_column('empresas', sa.Column('localidad', sa.String(length=255), nullable=False))
    op.add_column('empresas', sa.Column('provincia', sa.String(length=255), nullable=False))
    op.add_column('empresas', sa.Column('pais', sa.String(length=255), nullable=False))
    op.add_column('empresas', sa.Column('telefono', sa.String(length=255), nullable=True))
    op.add_column('empresas', sa.Column('email', sa.String(length=255), nullable=False))
    op.drop_column('empresas', 'empresa_email')
    op.drop_column('empresas', 'empresa_telefono')
    op.drop_column('empresas', 'empresa_localidad')
    op.drop_column('empresas', 'empresa_nombre')
    op.drop_column('empresas', 'empresa_id')
    op.drop_column('empresas', 'empresa_CUIT')
    op.drop_column('empresas', 'empresa_direccion')
    op.drop_column('empresas', 'empresa_provincia')
    op.drop_column('empresas', 'empresa_RS')
    op.drop_column('empresas', 'empresa_pais')
    op.add_column('pesadas', sa.Column('id', sa.Integer(), autoincrement=True, nullable=False))
    op.add_column('pesadas', sa.Column('fecha_hora_planta_in', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False))
    op.add_column('pesadas', sa.Column('fecha_hora_balanza_in', sa.TIMESTAMP(), nullable=True))
    op.add_column('pesadas', sa.Column('fecha_hora_balanza_out', sa.TIMESTAMP(), nullable=True))
    op.add_column('pesadas', sa.Column('turno_id', sa.Integer(), nullable=True))
    op.alter_column('pesadas', 'peso_bruto_in',
               existing_type=sa.NUMERIC(precision=9, scale=2),
               nullable=True)
    op.create_unique_constraint('unique_pesada_per_turno', 'pesadas', ['turno_id'])
    op.drop_constraint('pesadasIn_empresa_id_fkey', 'pesadas', type_='foreignkey')
    op.drop_constraint('pesadasIn_producto_id_fkey', 'pesadas', type_='foreignkey')
    op.drop_constraint('pesadasIn_chofer_id_fkey', 'pesadas', type_='foreignkey')
    op.create_foreign_key(None, 'pesadas', 'turnos', ['turno_id'], ['id'])
    op.drop_column('pesadas', 'pesada_id')
    op.drop_column('pesadas', 'chofer_id')
    op.drop_column('pesadas', 'empresa_id')
    op.drop_column('pesadas', 'producto_id')
    op.drop_column('pesadas', 'fecha_hora_out')
    op.drop_column('pesadas', 'fecha_hora_in')
    op.add_column('productos', sa.Column('id', sa.Integer(), autoincrement=True, nullable=False))
    op.add_column('productos', sa.Column('nombre', sa.String(length=255), nullable=False))
    op.drop_column('productos', 'producto_id')
    op.drop_column('productos', 'producto_nombre')
    op.add_column('silos', sa.Column('id', sa.Integer(), autoincrement=True, nullable=False))
    op.drop_constraint('silos_producto_id_fkey', 'silos', type_='foreignkey')
    op.create_foreign_key(None, 'silos', 'productos', ['producto_id'], ['id'])
    op.drop_column('silos', 'silo_id')
    op.add_column('turnos', sa.Column('id', sa.Integer(), autoincrement=True, nullable=False))
    op.add_column('turnos', sa.Column('state', sqlalchemy_utils.types.choice.ChoiceType(length=255), nullable=True))
    op.add_column('turnos', sa.Column('fecha', sa.TIMESTAMP(), nullable=False))
    op.drop_constraint('turnos_empresa_id_fkey', 'turnos', type_='foreignkey')
    op.drop_constraint('turnos_vehiculo_id_fkey', 'turnos', type_='foreignkey')
    op.drop_constraint('turnos_producto_id_fkey', 'turnos', type_='foreignkey')
    op.drop_constraint('turnos_chofer_id_fkey', 'turnos', type_='foreignkey')
    op.create_foreign_key(None, 'turnos', 'vehiculos', ['vehiculo_id'], ['id'])
    op.create_foreign_key(None, 'turnos', 'choferes', ['chofer_id'], ['id'])
    op.create_foreign_key(None, 'turnos', 'productos', ['producto_id'], ['id'])
    op.create_foreign_key(None, 'turnos', 'empresas', ['empresa_id'], ['id'])
    op.drop_column('turnos', 'turno_fecha')
    op.drop_column('turnos', 'turno_id')
    op.add_column('vehiculos', sa.Column('id', sa.Integer(), autoincrement=True, nullable=False))
    op.drop_constraint('vehiculos_empresa_id_fkey', 'vehiculos', type_='foreignkey')
    op.create_foreign_key(None, 'vehiculos', 'empresas', ['empresa_id'], ['id'])
    op.drop_column('vehiculos', 'vehiculo_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('vehiculos', sa.Column('vehiculo_id', sa.INTEGER(), server_default=sa.text("nextval('vehiculos_vehiculo_id_seq'::regclass)"), autoincrement=True, nullable=False))
    op.drop_constraint(None, 'vehiculos', type_='foreignkey')
    op.create_foreign_key('vehiculos_empresa_id_fkey', 'vehiculos', 'empresas', ['empresa_id'], ['empresa_id'])
    op.drop_column('vehiculos', 'id')
    op.add_column('turnos', sa.Column('turno_id', sa.INTEGER(), autoincrement=True, nullable=False))
    op.add_column('turnos', sa.Column('turno_fecha', postgresql.TIMESTAMP(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'turnos', type_='foreignkey')
    op.drop_constraint(None, 'turnos', type_='foreignkey')
    op.drop_constraint(None, 'turnos', type_='foreignkey')
    op.drop_constraint(None, 'turnos', type_='foreignkey')
    op.create_foreign_key('turnos_chofer_id_fkey', 'turnos', 'choferes', ['chofer_id'], ['chofer_id'])
    op.create_foreign_key('turnos_producto_id_fkey', 'turnos', 'productos', ['producto_id'], ['producto_id'])
    op.create_foreign_key('turnos_vehiculo_id_fkey', 'turnos', 'vehiculos', ['vehiculo_id'], ['vehiculo_id'])
    op.create_foreign_key('turnos_empresa_id_fkey', 'turnos', 'empresas', ['empresa_id'], ['empresa_id'])
    op.drop_column('turnos', 'fecha')
    op.drop_column('turnos', 'state')
    op.drop_column('turnos', 'id')
    op.add_column('silos', sa.Column('silo_id', sa.INTEGER(), autoincrement=True, nullable=False))
    op.drop_constraint(None, 'silos', type_='foreignkey')
    op.create_foreign_key('silos_producto_id_fkey', 'silos', 'productos', ['producto_id'], ['producto_id'])
    op.drop_column('silos', 'id')
    op.add_column('productos', sa.Column('producto_nombre', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('productos', sa.Column('producto_id', sa.INTEGER(), server_default=sa.text("nextval('productos_producto_id_seq'::regclass)"), autoincrement=True, nullable=False))
    op.drop_column('productos', 'nombre')
    op.drop_column('productos', 'id')
    op.add_column('pesadas', sa.Column('fecha_hora_in', postgresql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), autoincrement=False, nullable=False))
    op.add_column('pesadas', sa.Column('fecha_hora_out', postgresql.TIMESTAMP(), autoincrement=False, nullable=False))
    op.add_column('pesadas', sa.Column('producto_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('pesadas', sa.Column('empresa_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('pesadas', sa.Column('chofer_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('pesadas', sa.Column('pesada_id', sa.INTEGER(), server_default=sa.text('nextval(\'"pesadasIn_pesada_id_seq"\'::regclass)'), autoincrement=True, nullable=False))
    op.drop_constraint(None, 'pesadas', type_='foreignkey')
    op.create_foreign_key('pesadasIn_chofer_id_fkey', 'pesadas', 'choferes', ['chofer_id'], ['chofer_id'])
    op.create_foreign_key('pesadasIn_producto_id_fkey', 'pesadas', 'productos', ['producto_id'], ['producto_id'])
    op.create_foreign_key('pesadasIn_empresa_id_fkey', 'pesadas', 'empresas', ['empresa_id'], ['empresa_id'])
    op.drop_constraint('unique_pesada_per_turno', 'pesadas', type_='unique')
    op.alter_column('pesadas', 'peso_bruto_in',
               existing_type=sa.NUMERIC(precision=9, scale=2),
               nullable=False)
    op.drop_column('pesadas', 'turno_id')
    op.drop_column('pesadas', 'fecha_hora_balanza_out')
    op.drop_column('pesadas', 'fecha_hora_balanza_in')
    op.drop_column('pesadas', 'fecha_hora_planta_in')
    op.drop_column('pesadas', 'id')
    op.add_column('empresas', sa.Column('empresa_pais', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('empresas', sa.Column('empresa_RS', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('empresas', sa.Column('empresa_provincia', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('empresas', sa.Column('empresa_direccion', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('empresas', sa.Column('empresa_CUIT', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('empresas', sa.Column('empresa_id', sa.INTEGER(), server_default=sa.text("nextval('empresas_empresa_id_seq'::regclass)"), autoincrement=True, nullable=False))
    op.add_column('empresas', sa.Column('empresa_nombre', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('empresas', sa.Column('empresa_localidad', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('empresas', sa.Column('empresa_telefono', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
    op.add_column('empresas', sa.Column('empresa_email', sa.VARCHAR(length=255), server_default=sa.text("'CHANGE@ME.com'::character varying"), autoincrement=False, nullable=False))
    op.drop_column('empresas', 'email')
    op.drop_column('empresas', 'telefono')
    op.drop_column('empresas', 'pais')
    op.drop_column('empresas', 'provincia')
    op.drop_column('empresas', 'localidad')
    op.drop_column('empresas', 'direccion')
    op.drop_column('empresas', 'CUIT')
    op.drop_column('empresas', 'RS')
    op.drop_column('empresas', 'nombre')
    op.drop_column('empresas', 'id')
    op.add_column('choferes', sa.Column('chofer_id', sa.INTEGER(), server_default=sa.text("nextval('choferes_chofer_id_seq'::regclass)"), autoincrement=True, nullable=False))
    op.drop_constraint(None, 'choferes', type_='foreignkey')
    op.create_foreign_key('choferes_empresa_id_fkey', 'choferes', 'empresas', ['empresa_id'], ['empresa_id'])
    op.drop_column('choferes', 'id')
    # ### end Alembic commands ###